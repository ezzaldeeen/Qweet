from decouple import config


class AppConfig:
    __instance: 'AppConfig' = None

    def __init__(self):
        """
        get the following envs
        params:
            DB_HOST: Database host:port
            SVC_PORT: server port defaulted to the local one
        """
        self.db_host = config('DB_HOST', default='http://localhost:9200')
        self.svc_port = config('SVC_PORT', default=8080, cast=int)
        self.log_level = config('LOGLEVEL', default='INFO', cast=str)
        self.__instance = self

    def to_dict(self):
        """
        Returns: returns object as dictionary
        """
        return self.__dict__

    @classmethod
    def instance(cls) -> 'AppConfig':
        """
        get singleton object of the config
        Returns: config object
        """
        if cls.__instance is not None:
            return cls.__instance
        conf = cls()
        cls.__instance = conf
        return cls()
