TEST v 1.1
# UNICEF blockchain API test files


## Installation

```bash
npm install
```

## Migration command
```bash
DATABASE_URL=postgres://blockchain:testuser@postgres:5432/blockchain npm run migrate up
```

## Starting the Server
```bash
npm run dev
```

## Credentials
#### Admin role
```
email: uscipadmin@maildrop.cc
password: IskyAdmin1092@
```

#### Partner (assistant) role
```
email: uscipassist@maildrop.cc
password: IskyAssist1092@
```

#### Partner (authorised person) role
```
email: uscipauthorised@maildrop.cc
password: IskyAuthorised1092@
```

#### UNICEF (coordinator) role
```
email: uscipcoordinator@maildrop.cc
password: IskyCoordinator1092@
```

#### UNICEF (budget owner) role
```
email: uscipbudget@maildrop.cc
password: IskyBudget1092@
```

#### UNICEF (deputy representative) role
```
email: uscipdeputy@maildrop.cc
password: IskyDeputy1092@
```

#### UNICEF (operation manager) role
```
email: uscipoperation@maildrop.cc
password: IskyOperation1092@
```

#### Donor role
```
email: uscipdonor@maildrop.cc
password: IskyDonor1092@
```


lsof -i -n | grep 9229 | awk '{print $2}' | xargs kill
test