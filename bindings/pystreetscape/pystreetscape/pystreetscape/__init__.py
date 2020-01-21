from ._version import version_info, __version__

from .streetscape_avs import *
from .simpleserver import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'streetscape-jupyter',
        'require': 'streetscape-jupyter/extension'
    }]
