export default {
    "APP_PROTOCOL": "http://",
    "APP_NAME": "api.uscip.iskytest.com",
    "db" : {
        "host" : "unipgdbdevn01",
        "user" : "kazblkchndbusr",
        "password" : "K@zB1KL0ck",
        "database" : "kazblkchn_db"
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
        "activationExpiredDays" : 1,
        "setManualPasswordRoute" : "/auth/set-password",
        "setManualPasswordExpiredDays" : 3,
    },
    "jwt" : {
        "secret" : "uscip_d874nfydbd84nd"
    }
  };