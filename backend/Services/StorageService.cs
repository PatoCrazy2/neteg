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
        _bucketName = configuration["Storage:BucketName"] ?? "neteg-uploads";
        // En desarrollo (MinIO), el endpoint público puede ser diferente al interno de Docker.
        _publicEndpoint = configuration["Storage:PublicEndpoint"] ?? configuration["Storage:Endpoint"] ?? "http://localhost:9000";
    }

    public async Task<string> UploadFileAsync(IFormFile file, string folder = "uploads")
    {
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        using var stream = file.OpenReadStream();
        return await UploadStreamAsync(stream, fileName, file.ContentType, folder);
    }

    public async Task<string> UploadStreamAsync(Stream stream, string fileName, string contentType, string folder = "uploads")
    {
        var key = $"{folder}/{fileName}";

        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = stream,
            Key = key,
            BucketName = _bucketName,
            ContentType = contentType
        };

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

    public async Task EnsureBucketExistsAsync()
    {
        try
        {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, _bucketName);
            if (!bucketExists)
            {
                // Crear el bucket
                await _s3Client.PutBucketAsync(new PutBucketRequest
                {
                    BucketName = _bucketName,
                    UseClientRegion = true
                });

                // Configurar política pública (Lectura para todos)
                // Esto es necesario para que el navegador pueda mostrar las imágenes
                var publicPolicy = $@"{{
                    ""Version"": ""2012-10-17"",
                    ""Statement"": [
                        {{
                            ""Effect"": ""Allow"",
                            ""Principal"": ""*"",
                            ""Action"": [""s3:GetObject""],
                            ""Resource"": [""arn:aws:s3:::{_bucketName}/*""]
                        }}
                    ]
                }}";

                await _s3Client.PutBucketPolicyAsync(_bucketName, publicPolicy);
            }
        }
        catch (Exception ex)
        {
            // En producción (R2/S3 real), podrías no tener permisos para crear buckets 
            // o poner políticas, así que solo logueamos el error.
            Console.WriteLine($"[StorageService] Error inicializando bucket: {ex.Message}");
        }
    }
}
