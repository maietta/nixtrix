{ pkgs ? import <nixpkgs> {} }:

let
  lib = import ./lib.nix { inherit pkgs; };
in
pkgs.writeShellApplication {
  name = "nixtrix-add";
  runtimeInputs = [ pkgs.coreutils pkgs.gnused ];
  text = ''
    set -e

    USAGE="Usage: nixtrix-add [--component|--route|--lib] <package>...
    
    Add packages to your project.
    
    Options:
      --component  Package is a UI component (default)
      --route     Package is a full route
      --lib       Package is a library
    
    Examples:
      nixtrix-add sticky-header sidebar
      nixtrix-add --route blog
      nixtrix-add --lib auth"

    TYPE="component"
    
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --component)
          TYPE="component"
          shift
          ;;
        --route)
          TYPE="route"
          shift
          ;;
        --lib)
          TYPE="lib"
          shift
          ;;
        -h|--help)
          echo "$USAGE"
          exit 0
          ;;
        -*)
          echo "Unknown option: $1"
          echo "$USAGE"
          exit 1
          ;;
        *)
          break
          ;;
      esac
    done

    if [[ $# -eq 0 ]]; then
      echo "Error: No packages specified"
      echo "$USAGE"
      exit 1
    fi

    echo "Adding packages: $*"

    # TODO: Copy packages from NixTrix to user's project
    # For now, just print what would be added
    
    for pkg in "$@"; do
      echo "  + $pkg ($TYPE)"
    done

    echo ""
    echo "Note: Full implementation will copy files and update flake.nix"
  '';
}
