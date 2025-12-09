#!/usr/bin/env sh

if [ -z "$husky_skip_init" ]; then
  export husky_skip_init=1

  command_path="$(command -v sh)"
  if [ -n "$command_path" ]; then
    command "$command_path" "$0" "$@"
    exit $?
  fi

  if command -v sh >/dev/null 2>&1; then
    sh "$0" "$@"
    exit $?
  fi
fi
