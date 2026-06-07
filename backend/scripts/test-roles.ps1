// Test script para validar proteção de roles
$baseUrl = "http://localhost:3001"
$tests = @(
    @{ role = "admin"; email = "admin@coopelos.com.br"; password = "coopelos2026" },
    @{ role = "rh"; email = "rh@coopelos.com.br"; password = "teste123" },
    @{ role = "dp"; email = "dp@coopelos.com.br"; password = "teste123" },
    @{ role = "viewer"; email = "viewer@coopelos.com.br"; password = "teste123" }
)

# Endpoints para testar
$endpoints = @(
    @{ name = "GET /users (admin only)"; method = "GET"; url = "/api/users"; allowed = @("admin") },
    @{ name = "GET /audit (admin,rh)"; method = "GET"; url = "/api/audit"; allowed = @("admin","rh") },
    @{ name = "GET /payrolls (admin,dp)"; method = "GET"; url = "/api/payrolls"; allowed = @("admin","dp") },
    @{ name = "GET /tasks (all)"; method = "GET"; url = "/api/tasks"; allowed = @("admin","rh","dp","viewer") },
    @{ name = "GET /vacations (admin,rh)"; method = "GET"; url = "/api/vacations"; allowed = @("admin","rh") },
    @{ name = "GET /cooperados (admin,rh,dp)"; method = "GET"; url = "/api/cooperados"; allowed = @("admin","rh","dp") }
)

function Test-Endpoint {
    param($user, $endpoint, $baseUrl)

    try {
        # Login
        $loginBody = @{ email = $user.email; password = $user.password } | ConvertTo-Json
        $loginResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing
        $userId = ($loginResp.Content | ConvertFrom-Json).userId
        $coopId = ($loginResp.Content | ConvertFrom-Json).cooperativeId

        # Tentar acessar o endpoint
        $headers = @{
            "X-User-Id" = $userId
            "X-Cooperative-Id" = $coopId
        }
        $resp = Invoke-WebRequest -Uri "$baseUrl$($endpoint.url)" -Method $endpoint.method -Headers $headers -UseBasicParsing
        $status = $resp.StatusCode
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
    }

    $allowed = $endpoint.allowed -contains $user.role
    $expected = if ($allowed) { "200/201" } else { "403" }
    $result = if (($allowed -and $status -lt 400) -or (-not $allowed -and $status -eq 403)) { "✅" } else { "❌" }

    return "$result $($user.role.ToUpper()) → $($endpoint.name) : HTTP $status (esperado: $expected)"
}

Write-Host "`n=== Testes de Proteção de Roles ===`n"

foreach ($endpoint in $endpoints) {
    Write-Host "--- $($endpoint.name) ---"
    foreach ($user in $tests) {
        $result = Test-Endpoint -user $user -endpoint $endpoint -baseUrl $baseUrl
        Write-Host "  $result"
    }
    Write-Host ""
}
