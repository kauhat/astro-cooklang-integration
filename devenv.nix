{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [ pkgs.git pkgs.nodePackages.pnpm ];

  # https://devenv.sh/scripts/
  scripts.buildPackage.exec = "pnpm -w run build $1";
  scripts.buildDemo.exec = "pnpm -w run demo:build $1";

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
    build.exec = "buildPackage -w";
    build-demo.exec = "buildDemo";
  };

  # See full reference at https://devenv.sh/reference/options/
}
