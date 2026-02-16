{
  description = "NixTrix SvelteKit site";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ self.overlays.default ];
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22
            pkgs.pnpm
            pkgs.eslint
            pkgs.prettier
          ];

          shellHook = ''
            export NODE_ENV=development
            echo "NixTrix dev shell ready"
          '';
        };
      }
    ) // {
      overlays.default = final: prev: {
        nodejs = prev.nodejs_22;
      };
    };
}
