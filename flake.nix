{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.11";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, systems, ... } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      devShells = forEachSystem
        (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                {
                  # https://devenv.sh/basics/
                  env.GREET = "devenv";

                  # https://devenv.sh/packages/
                  packages = [
                    pkgs.git
                    pkgs.nodejs-16_x
                    pkgs.nodePackages.pnpm
                    pkgs.netlify-cli
                  ];

                  # https://devenv.sh/scripts/
                  scripts.build-package.exec = "pnpm -w run build $1";
                  scripts.build-demo.exec = "pnpm -w run demo:build $1";

                  enterShell = ''
                    git --version
                  '';

                  # https://devenv.sh/languages/
                  languages = {
                    nix.enable = true;
                    typescript.enable = true;
                  };

                  # https://devenv.sh/pre-commit-hooks/
                  pre-commit.hooks = {
                    # shellcheck.enable = true;
                    # prettier.enable = true;
                  };

                  # https://devenv.sh/processes/
                  # processes.ping.exec = "ping example.com";
                  processes = {
                    build.exec = "build-package -w";
                    build-demo.exec = "build-demo";
                  };

                  # See full reference at https://devenv.sh/reference/options/
                }
              ];
            };
          });
    };
}
