using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace backend.Services;

public class StorageService : IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string _publicEndpoint;

    public StorageService(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _bucketName = configuration["S3:BucketName"] ?? "neteg-uploads";
        // En desarrollo (MinIO), el endpoint público puede ser diferente al interno de Docker.
        // Usamos una variable de configuración para la URL que verá el cliente.
        _publicEndpoint = configuration["S3:PublicEndpoint"] ?? configuration["S3:ServiceUrl"] ?? "http://localhost:9000";
    }

    public async Task<string> UploadFileAsync(IFormFile file, string folder = "uploads")
    {
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var key = $"{folder}/{fileName}";

        using var newStream = new MemoryStream();
        await file.CopyToAsync(newStream);

        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = newStream,
            Key = key,
            BucketName = _bucketName,
            ContentType = file.ContentType
        };

        // En MinIO/S3, para que sea público sin presigned URL persistente, 
        // el bucket debe tener política pública o usamos CannedACL.
        uploadRequest.CannedACL = S3CannedACL.PublicRead;

        var fileTransferUtility = new TransferUtility(_s3Client);
        await fileTransferUtility.UploadAsync(uploadRequest);

        return $"{_publicEndpoint}/{_bucketName}/{key}";
    }

    public async Task DeleteFileAsync(string fileUrl)
    {
        // Extraer la llave del URL (ej: http://localhost:9000/bucket/folder/file.jpg)
        var uri = new Uri(fileUrl);
        var pathParts = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
        
        if (pathParts.Length < 2) return;

        // El primer segmento es el bucket, el resto es la llave
        var key = string.Join('/', pathParts.Skip(1));

        await _s3Client.DeleteObjectAsync(_bucketName, key);
    }
}
