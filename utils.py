#!/usr/bin/env python

"""
Handy utility functions -- mostly for adjusting the sys path and/or
finding the Google App Engine SDK.
"""

import sys
import os


def adjust_sys_path(dir_name=''):
    """
    Patch to search the libs folder. At the moment, I believe it's unable to
    find .egg's, but it does search libs for imports before anything else.
    """
    root_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, os.path.join(root_dir, dir_name))

