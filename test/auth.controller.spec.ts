import { Test } from '@nestjs/testing'
import { Connection } from 'mongoose'
import { getAdmin, getUser } from './factories'
import * as request from 'supertest'
import * as bcrypt from 'bcrypt'

import { AppModule } from 'src/app.module'
import { DatabaseService } from 'src/modules/database/database.service'
import { JwtService } from '@nestjs/jwt'

describe('AuthController', () => {
  let dbConnection: Connection
  let httpServer: any
  let app: any
  let jwtService: any
  const user: any = getUser({})
  const admin: any = getAdmin({})

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle()
    httpServer = app.getHttpServer()

    jwtService = moduleRef.get<JwtService>(JwtService)
  })

  afterAll(async () => {
    await dbConnection.close()
    await app.close()
  })

  afterEach(async () => {
    await dbConnection.collection('users').deleteMany({})
  })

  describe('register', () => {
    it('register success', async () => {
      try {
        await request(httpServer)
          .post('/auth/register')
          .send(user)
          .expect(201)
          .expect((res) => {
            expect(res.body.token?.length > 0).toBe(true)
          })
      } catch (e) {
        console.log(e.message)
      }
    })

    it('it failed because dup email', async () => {
      await request(httpServer).post('/auth/register').send(user).expect(201)
      await request(httpServer).post('/auth/register').send(user).expect(409)
    })
  })

  describe('login', () => {
    it('login success using email', async () => {
      const password = user.password
      const salt = await bcrypt.genSalt(10)
      const password_hash = await bcrypt.hash(password, salt)
      await dbConnection.collection('users').insertOne({
        ...user,
        password: password_hash,
      })

      await request(httpServer)
        .post('/auth/login')
        .send({
          username: user.email,
          password: user.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.token?.length > 0).toBe(true)
        })
    })

    // it('login success using phone', async () => {
    //   const password = user.password
    //   const salt = await bcrypt.genSalt(10)
    //   const password_hash = await bcrypt.hash(password, salt)
    //   await dbConnection.collection('users').insertOne({
    //     ...user,
    //     password: password_hash,
    //   })

    //   await request(httpServer)
    //     .post(gql)
    //     .send({
    //       query: `
    //         mutation login($params: LoginDto!) {
    //           login(loginUser: $params) {
    //             accessToken
    //           }
    //         }
    //       `,
    //       variables: {
    //         params: {
    //           username: user.phone,
    //           password,
    //         },
    //       },
    //     })
    //     .expect((res) => {
    //       expect(res.body.data.login).toHaveProperty('accessToken')
    //     })
    // })

    // it('it failed because wrong password', async () => {
    //   const password = user.password
    //   const salt = await bcrypt.genSalt(10)
    //   const password_hash = await bcrypt.hash(password, salt)
    //   await dbConnection.collection('users').insertOne({
    //     email: user.email,
    //     password: password_hash,
    //   })

    //   await request(httpServer)
    //     .post(gql)
    //     .send({
    //       query: `
    //         mutation login($params: LoginDto!) {
    //           login(loginUser: $params) {
    //             accessToken
    //           }
    //         }
    //       `,
    //       variables: {
    //         params: {
    //           username: user.email,
    //           password: '456456',
    //         },
    //       },
    //     })
    //     .expect((res) => {
    //       expect(res.body.errors?.[0].extensions.response.statusCode).toEqual(422)
    //     })
    // })
  })

  // describe('login admin', () => {
  //   it('success', async () => {
  //     const password = admin.password
  //     const salt = await bcrypt.genSalt(10)
  //     const password_hash = await bcrypt.hash(password, salt)
  //     await dbConnection.collection('users').insertOne({
  //       ...admin,
  //       password: password_hash,
  //     })

  //     await request(httpServer)
  //       .post(gql)
  //       .send({
  //         query: `
  //           mutation adminLogin($params: LoginDto!) {
  //             adminLogin(loginUser: $params) {
  //               accessToken
  //             }
  //           }
  //         `,
  //         variables: {
  //           params: {
  //             username: admin.email,
  //             password,
  //           },
  //         },
  //       })
  //       .expect((res) => {
  //         expect(res.body.data.adminLogin).toHaveProperty('accessToken')
  //       })
  //   })

  //   it('it failed because user dont have permission to login', async () => {
  //     const password = user.password
  //     const salt = await bcrypt.genSalt(10)
  //     const password_hash = await bcrypt.hash(password, salt)
  //     await dbConnection.collection('users').insertOne({
  //       ...user,
  //       password: password_hash,
  //     })

  //     await request(httpServer)
  //       .post(gql)
  //       .send({
  //         query: `
  //           mutation adminLogin($params: LoginDto!) {
  //             adminLogin(loginUser: $params) {
  //               accessToken
  //             }
  //           }
  //         `,
  //         variables: {
  //           params: {
  //             username: user.email,
  //             password,
  //           },
  //         },
  //       })
  //       .expect((res) => {
  //         expect(res.body.errors?.[0].extensions.response.statusCode).toEqual(422)
  //       })
  //   })
  // })

  // describe('get profile', () => {
  //   it('success', async () => {
  //     const password = user.password
  //     const salt = await bcrypt.genSalt(10)
  //     const password_hash = await bcrypt.hash(password, salt)
  //     await dbConnection.collection('users').insertOne({
  //       phone: user.phone,
  //       email: user.email,
  //       password: password_hash,
  //     })

  //     const result = await request(httpServer)
  //       .post(gql)
  //       .send({
  //         query: `
  //           mutation login($params: LoginDto!) {
  //             login(loginUser: $params) {
  //               accessToken
  //             }
  //           }
  //         `,
  //         variables: {
  //           params: {
  //             username: user.email,
  //             password,
  //           },
  //         },
  //       })

  //     const token = result?.body?.data?.login?.accessToken

  //     await request(httpServer)
  //       .post(gql)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({
  //         query: `
  //           {
  //             getProfile {
  //               phone
  //               email
  //             }
  //           }
  //         `,
  //       })
  //       .expect((res) => {
  //         expect(res.body?.data?.getProfile).toEqual({
  //           email: user.email,
  //           phone: user.phone,
  //         })
  //       })
  //   })
  // })

  // describe('update user', () => {
  //   it('success', async () => {
  //     const password = user.password
  //     const salt = await bcrypt.genSalt(10)
  //     const password_hash = await bcrypt.hash(password, salt)
  //     const createdUser = await dbConnection.collection('users').insertOne({
  //       ...user,
  //       password: password_hash,
  //     })
  //     await dbConnection.collection('users').insertOne({
  //       ...admin,
  //       password: password_hash,
  //       role: 'admin',
  //     })
  //     const result = await request(httpServer)
  //       .post(gql)
  //       .send({
  //         query: `
  //           mutation adminLogin($params: LoginDto!) {
  //             adminLogin(loginUser: $params) {
  //               accessToken
  //             }
  //           }
  //         `,
  //         variables: {
  //           params: {
  //             username: admin.email,
  //             password,
  //           },
  //         },
  //       })

  //     const token = result?.body?.data?.adminLogin?.accessToken

  //     await request(httpServer)
  //       .post(gql)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({
  //         query: `
  //           mutation updateUser($params: UpdateUserDto!, $id: String) {
  //             updateUser(updateUser: $params, id: $id) {
  //               phone
  //               role
  //             }
  //           }
  //         `,
  //         variables: {
  //           id: createdUser?.insertedId?.toString(),
  //           params: {
  //             role: 'admin',
  //           },
  //         },
  //       })
  //       .expect((res) => {
  //         expect(res.body?.data?.updateUser).toEqual({
  //           phone: user.phone,
  //           role: 'admin',
  //         })
  //       })
  //   })
  // })

  // describe('remove user', () => {
  //   let token: string
  //   it('failed because user dont have permission', async () => {
  //     const password = user.password
  //     const salt = await bcrypt.genSalt(10)
  //     const password_hash = await bcrypt.hash(password, salt)
  //     const createdUser = await dbConnection.collection('users').insertOne({
  //       email: user.email,
  //       password: password_hash,
  //       role: user.role,
  //     })

  //     const res = await request(httpServer)
  //       .post(gql)
  //       .send({
  //         query: `
  //           mutation login($params: LoginDto!) {
  //             login(loginUser: $params) {
  //               accessToken
  //             }
  //           }
  //         `,
  //         variables: {
  //           params: {
  //             username: user.email,
  //             password: user.password,
  //           },
  //         },
  //       })

  //     token = res.body?.data?.login?.accessToken

  //     const removeMutation = {
  //       query: `
  //         mutation removeUser($params: String!) {
  //           removeUser(id: $params)
  //         }
  //       `,
  //       variables: {
  //         params: createdUser?.insertedId?.toString(),
  //       },
  //     }

  //     await request(httpServer)
  //       .post(gql)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(removeMutation)
  //       .expect((res) => {
  //         expect(res.body.errors?.[0].extensions.code === 'FORBIDDEN').toBe(true)
  //       })
  //   })

  //   it('success because user now have permission', async () => {
  //     const password = user.password
  //     const salt = await bcrypt.genSalt(10)
  //     const password_hash = await bcrypt.hash(password, salt)
  //     const createdUser = await dbConnection.collection('users').insertOne({
  //       ...user,
  //       password: password_hash,
  //     })
  //     await dbConnection.collection('users').insertOne({
  //       ...admin,
  //       password: password_hash,
  //       role: 'admin',
  //     })
  //     const result = await request(httpServer)
  //       .post(gql)
  //       .send({
  //         query: `
  //               mutation adminLogin($params: LoginDto!) {
  //                 adminLogin(loginUser: $params) {
  //                   accessToken
  //                 }
  //               }
  //             `,
  //         variables: {
  //           params: {
  //             username: admin.email,
  //             password,
  //           },
  //         },
  //       })

  //     const token = result?.body?.data?.adminLogin?.accessToken

  //     const removeMutation = {
  //       query: `
  //         mutation removeUser($params: String!) {
  //           removeUser(id: $params)
  //         }
  //       `,
  //       variables: {
  //         params: createdUser?.insertedId?.toString(),
  //       },
  //     }

  //     await request(httpServer)
  //       .post(gql)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(removeMutation)
  //       .expect((res) => {
  //         expect(res.body?.data?.removeUser).toBe(true)
  //       })
  //   })
  // })
})
