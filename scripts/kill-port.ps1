param(
    [Parameter(Mandatory = $true)]
    [int]$Port
)

Write-Host "[kill-port] Checking port $Port..." -ForegroundColor Cyan

function Stop-PortProcess {
    param(
        [int]$ProcessId
    )

    try {
        $process = Get-Process -Id $ProcessId -ErrorAction Stop
        Write-Host "[kill-port] Stopping PID $ProcessId ($($process.ProcessName))" -ForegroundColor Yellow
        Stop-Process -Id $ProcessId -Force -ErrorAction Stop
        Start-Sleep -Milliseconds 300
        Write-Host "[kill-port] PID $ProcessId stopped." -ForegroundColor Green
    }
    catch {
        Write-Host "[kill-port] Unable to stop PID $ProcessId ($($_.Exception.Message))" -ForegroundColor DarkYellow
    }
}

$connections = @()

try {
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction Stop
}
catch {
    Write-Host "[kill-port] Get-NetTCPConnection unavailable, falling back to netstat." -ForegroundColor DarkYellow
}

$processIds = @()

if ($connections.Count -gt 0) {
    $processIds = $connections | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique
}
else {
    $netstatOutput = netstat -ano | Select-String ":$Port" -ErrorAction SilentlyContinue
    if ($netstatOutput) {
        foreach ($line in $netstatOutput) {
            $parts = ($line.ToString() -split "\s+")
            $pid = $parts[-1]
            if ($pid -match '^[0-9]+$') {
                $processIds += [int]$pid
            }
        }
        $processIds = $processIds | Sort-Object -Unique
    }
}

if (-not $processIds -or $processIds.Count -eq 0) {
    Write-Host "[kill-port] No processes found on port $Port." -ForegroundColor Green
    exit 0
}

foreach ($processId in $processIds) {
    Stop-PortProcess -ProcessId $processId
}

Write-Host "[kill-port] Port $Port cleared." -ForegroundColor Cyan

exit 0