{ lib }:

let
  manifestPath = ./src/lib/packages/manifest.json;
in
rec {
  getManifest = builtins.fromJSON (builtins.readFile manifestPath);

  getPackage = type: name:
    let
      manifest = getManifest;
      packages = manifest.${type}s or {};
    in
    if packages ? ${name}
    then packages.${name}
    else throw "Package '${name}' not found in ${type}s";

  listPackages = type:
    let
      manifest = getManifest;
      packages = manifest.${type}s or {};
    in
    builtins.attrNames packages;

  listAllPackages = 
    (listPackages "component")
    ++ (listPackages "route")
    ++ (listPackages "lib");
}
