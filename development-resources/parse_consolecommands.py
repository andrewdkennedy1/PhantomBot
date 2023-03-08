# Copyright (C) 2016-2023 phantombot.github.io/PhantomBot
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

# Doc-comment definition

# /**
#  * @consolecommand commandName [requiredParameter] (optionalParameter) - Description
#  */

import os

md_path = "./docs/guides/content/commands/console-commands.md"

commands = []

# States
# 0 = Outside multi-line comment block
# 1 = Inside multi-line comment block
def parse_file(fpath, lines):
    global commands
    state = 0
    for line in lines:
        line = line.strip()
        if line == "/**" and state == 0:
            state = 1
        if line == "*/" and state > 0:
            state = 0
        if line.startswith("* ") and len(line) > 2 and state > 0:
            line = line[2:].strip()
            if line.startswith("@consolecommand"):
                line = line[16:].strip()
                cmd_pos = line.find(" ")
                if cmd_pos == -1:
                    cmd_pos = len(line)
                cmd = line[:cmd_pos].strip()
                commands.append({"command": cmd, "definition": line, "source": fpath})

def output_command(command, hlevel):
    h = "#"
    while len(h) < hlevel:
        h += "#"
    return [
        f"{h} " + command["command"] + '\n',
        '\n',
        "Defined in source file: _" + command["source"] + "_" + '\n',
        '\n',
        command["definition"] + '\n',
        '\n',
        "&nbsp;" + '\n',
        '\n',
    ]

for subdir, dirs, files in os.walk("./source"):
    for fname in files:
        fpath = subdir + os.sep + fname
        if fpath.endswith(".java"):
            with open(fpath, encoding="utf8") as java_file:
                parse_file(fpath, [line.rstrip('\n') for line in java_file])

lines = [
    "## Console Commands" + '\n',
    '\n',
    "**These console commands are available directly in the bot console when not running as a service.**"
    + '\n',
    '\n',
    "&nbsp;" + '\n',
    '\n',
    "<!-- toc -->" + '\n',
    '\n',
    "<!-- tocstop -->" + '\n',
    '\n',
    "&nbsp;" + '\n',
    '\n',
    "Parameters enclosed in square brackets `[ ]` are required when using the command"
    + '\n',
    '\n',
    "Parameters enclosed in parenthesis `( )` are optional when using the command"
    + '\n',
    '\n',
]

for command in commands:
    lines.extend(output_command(command, 3))

lines = lines[:len(lines) - 3]

with open(md_path, "w", encoding="utf8") as md_file:
    md_file.writelines(lines)
