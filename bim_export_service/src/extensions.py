###
# regiter all flask extensions #
###
from src.providers.ForgeProvider import ForgeProvider

data_provider = ForgeProvider()

def init_settings(settings):
    data_provider.init_app(settings)
