#!/bin/sh

killall polybar
polybar bottom -c ~/.config/polybar/config &
polybar top -c ~/.config/polybar/config &
