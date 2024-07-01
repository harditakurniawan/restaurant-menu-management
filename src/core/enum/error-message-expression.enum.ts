export enum ErrorMessageExpression {
    TOKENEXPIRED                        = `token already expired`,
    DATABASE_HAS_NOT_BEEN_SET           = `no connection string has been provided in the .env file.`,
    DATA_ALREADY_EXISTS                 = 'data already exsits',
    DATA_NOT_FOUND                      = 'data not found',
    LIMIT_EMAIL                         = 'please wait after 1 minute',
    NO_DATA                             = 'no data',
    NOT_ACCEPTABLE_PAYLOAD              = 'payload not acceptable',
    PASSWORD_INCORRECT                  = 'password incorrect',
    USER_ALREADY_VERIFIED               = 'user already verified',
    USER_NOT_VERIFIED_YET               = 'user has not verified yet',
}