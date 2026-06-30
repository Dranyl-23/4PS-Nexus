$ErrorActionPreference = "Stop"

# Create a temporary directory for OZ contracts
$OZ_DIR = "c:\Users\Alfie Lynard\OneDrive\Desktop\Stellar\contracts\openzeppelin"
if (!(Test-Path -Path $OZ_DIR)) {
    New-Item -ItemType Directory -Path $OZ_DIR
}
cd $OZ_DIR

Write-Host "Cloning OpenZeppelin stellar-contracts..."
if (!(Test-Path -Path "stellar-contracts")) {
    git clone https://github.com/OpenZeppelin/stellar-contracts.git
}

cd stellar-contracts
Write-Host "Checking out v0.7.2..."
git checkout v0.7.2

Write-Host "Building Smart Account Contract..."
stellar contract build --package multisig-account-example

Write-Host "Building WebAuthn Verifier Contract..."
stellar contract build --package multisig-webauthn-verifier-example

Write-Host "Compilation finished!"
