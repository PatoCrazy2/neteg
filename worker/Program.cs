using backend.Infrastructure;
using backend.Repositories;
using backend.Services;
using Hangfire;
using Hangfire.Redis.StackExchange;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using shared.Interfaces;
using worker.Jobs;

var builder = Host.CreateApplicationBuilder(args);

// DB Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IParticipantRepository, ParticipantRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();

// Services
builder.Services.AddScoped<IStorageService, StorageService>();
builder.Services.AddScoped<ITicketSecurityService, TicketSecurityService>();

// S3 Configuration
var storageConfig = builder.Configuration.GetSection("Storage");
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = new AmazonS3Config
    {
        ServiceURL = storageConfig["Endpoint"],
        ForcePathStyle = true
    };
    return new AmazonS3Client(storageConfig["AccessKey"], storageConfig["SecretKey"], config);
});

// Hangfire Configuration
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseRedisStorage(builder.Configuration.GetValue<string>("Redis:ConnectionString") ?? "localhost:6379"));

builder.Services.AddHangfireServer(options => {
    options.WorkerCount = 10;
    options.Queues = new[] { "default" };
});

builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Jobs
builder.Services.AddScoped<IGenerateTicketJob, GenerateTicketJob>();

var host = builder.Build();

// Initialize Storage (Create Bucket)
using (var scope = host.Services.CreateScope())
{
    var storageService = scope.ServiceProvider.GetRequiredService<IStorageService>();
    await storageService.EnsureBucketExistsAsync();
}

await host.RunAsync();
