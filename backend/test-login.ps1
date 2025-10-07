$loginData = @{
    email = "admin@tecnm.mx"
    password = "admin123"
} | ConvertTo-Json

Write-Host "🧪 Probando login con admin@tecnm.mx..."
Write-Host "📤 Datos enviados: $loginData"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/login" -Method POST -ContentType "application/json" -Body $loginData
    
    Write-Host "✅ Respuesta exitosa!"
    Write-Host "📥 Status: $($response.StatusCode)"
    Write-Host "📄 Content: $($response.Content)"
} catch {
    Write-Host "❌ Error en la petición:"
    Write-Host "📄 Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "📄 Response Body: $responseBody"
    }
}