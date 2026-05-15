using Microsoft.AspNetCore.Http;

namespace backend.Services;

public interface IStorageService
{
    /// <summary>
    /// Uploads a file to the storage provider (MinIO/S3).
    /// </summary>
    /// <param name="file">The file to upload.</param>
    /// <param name="folder">Optional folder path.</param>
    /// <returns>The public URL of the uploaded file.</returns>
    Task<string> UploadFileAsync(IFormFile file, string folder = "uploads");

    /// <summary>
    /// Deletes a file from the storage provider.
    /// </summary>
    /// <param name="fileUrl">The full URL of the file to delete.</param>
    Task DeleteFileAsync(string fileUrl);
}
