{
  description = "NixTrix — SvelteKit Package Manager";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    let
      lib = import ./cli/lib.nix { pkgs = nixpkgs; };
    in
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ self.overlays.default ];
        };
        add = import ./cli/add.nix { inherit pkgs; };
        update = import ./cli/update.nix { inherit pkgs; };
        remove = import ./cli/remove.nix { inherit pkgs; };
      in
      {
        packages = {
          inherit add update remove;
          
          default = self.packages.${system}.add;
          
          list-packages = pkgs.writeShellApplication {
            name = "nixtrix-list";
            text = ''
              echo "Available packages:"
              echo ""
              echo "Components:"
              for pkg in ${lib.listPackages "component"}; do
                echo "  - $pkg"
              done
              echo ""
              echo "Routes:"
              for pkg in ${lib.listPackages "route"}; do
                echo "  - $pkg"
              done
              echo ""
              echo "Libraries:"
              for pkg in ${lib.listPackages "lib"}; do
                echo "  - $pkg"
              done
            '';
          };
        };

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
