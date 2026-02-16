{ pkgs ? import <nixpkgs> {} }:

pkgs.writeShellApplication {
  name = "nixtrix-remove";
  runtimeInputs = [ pkgs.coreutils ];
  text = ''
    set -e

    USAGE="Usage: nixtrix-remove <package>...
    
    Remove packages from your project.
    
    Examples:
      nixtrix-remove sticky-header"

    if [[ $# -eq 0 || "$1" == "-h" || "$1" == "--help" ]]; then
      echo "$USAGE"
      [[ $# -eq 0 ]] && exit 1 || exit 0
    fi

    echo "Removing packages: $*"

    # TODO: Remove package files from user's project
    # TODO: Update flake.nix to remove from selectedPackages

    for pkg in "$@"; do
      echo "  - $pkg"
    done

    echo ""
    echo "Note: Full implementation will remove files and update flake.nix"
  '';
}
