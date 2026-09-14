#!/bin/bash

echo "Checking project files..."

test -f index.html
test -f README.md
test -f Makefile

echo "Tests Passed"