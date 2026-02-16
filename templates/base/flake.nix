{
  description = "NixTrix SvelteKit project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    NixTrix.url = "github:maietta/NixTrix";
  };

  outputs = { self, nixpkgs, NixTrix }:
    let
      overlay = final: prev: {
        nodejs = prev.nodejs_22;
      };
    in
    {
      devShells.x86_64-linux = import "${nixpkgs}/nixos" {
        configuration = { pkgs, ... }: {
          _module.args = { inherit overlay; };
          nixpkgs.overlays = [ overlay ];
          environment.systemPackages = with pkgs; [
            nodejs_22
            pnpm
          ];
        };
      };

      devShells.aarch64-linux = import "${nixpkgs}/nixos" {
        configuration = { pkgs, ... }: {
          _module.args = { inherit overlay; };
          nixpkgs.overlays = [ overlay ];
          environment.systemPackages = with pkgs; [
            nodejs_22
            pnpm
          ];
        };
      };
    };
}
