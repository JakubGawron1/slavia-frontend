Get-ChildItem -Path components\plans -Filter *.ts* | ForEach-Object {
    $count = (Get-Content $_.FullName).Count
    Write-Output ("{0} : {1}" -f $_.Name, $count)
}
