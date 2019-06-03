export default {
    "APP_NAME": "api.uscip.iskytest.com",
    "db" : {
        "host" : "postgres",
        "user" : "blockchain",
        "password" : "testuser",
        "database" : "blockchain"
    },
    "mail" : {
        "from" : '"USCIP 👻" <noreply@uscip.com>'
    },
    "locales" : {
        "en" : {
            "code" : "en",
            "title" : "English"
        },
        "ru" : {
            "code" : "ru",
            "title" : "Русский"
        }
    },
    "client" : {
        "activationRoute" : "/auth/activate-account",
        "activationExpiredDays" : 3,
        "setManualPasswordRoute" : "/auth/set-password",
        "setManualPasswordExpiredDays" : 3,
    },
    "jwt" : {
        "secret" : "uscip_d874nfydbd84nd"
    }
  };