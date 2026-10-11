# High-compatibility raw socket HTTP server for local & tunneled traffic
$port = 3000
$root = $PSScriptRoot

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".mjs"   = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".webp"  = "image/webp"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".woff2" = "font/woff2"
    ".woff"  = "font/woff"
    ".ttf"   = "font/ttf"
}

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
$listener.Start()
Write-Host "TCP Web Server listening on 0.0.0.0:$port"

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        
        $requestLine = $reader.ReadLine()
        if (-not [string]::IsNullOrEmpty($requestLine)) {
            $parts = $requestLine.Split(' ')
            if ($parts.Length -ge 2) {
                $rawPath = $parts[1].Split('?')[0].TrimStart('/')
                if ([string]::IsNullOrEmpty($rawPath)) { $rawPath = "index.html" }
                
                $filePath = Join-Path $root $rawPath
                if (Test-Path $filePath -PathType Leaf) {
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $mime = $mimeTypes[$ext]
                    if (-not $mime) { $mime = "application/octet-stream" }
                    
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $notFound = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: 9`r`nConnection: close`r`n`r`nNot Found"
                    $bytes = [System.Text.Encoding]::ASCII.GetBytes($notFound)
                    $stream.Write($bytes, 0, $bytes.Length)
                }
            }
        }
        $stream.Flush()
        $client.Close()
    }
} finally {
    $listener.Stop()
}
