const db = require('./models')

async function manyCrud() {
  console.dir(db.beer)

  const beer = await db.beer.create({
    name: "IPA",
    yeast: "yeast",
    description: "bitter"
  })


  const makeReview = await db.review.create({
    review: "Poppy"
  })

  await beer.addReview(makeReview)
  const getReviews = await db.review.findAll()


  console.log(getReviews)
 
//   try {
//     // fooInstance.addBar
//     const [user, userCreated] = await db.user.findOrCreate({
//       where: {
//         email: "test@test.com",
//       }
//     })

//     const [beer, beerCreated] = await db.beer.findOrCreate({
//       where: {
//         name: "Comet"
//       }
//     })


//     await user.addBeer(beer)
//     const getUsers = await beer.getUsers()
//     const getBeers = await pet.getBeers()
//     console.log(getUsers)
//     const firstUser = await db.user.findByPk(1)
//     // console.log(firstUser)
//     await firstUser.createBeer({
//      name: "Comet"
//     })

//     const firstUserBeers = await firstUser.getBeers()
//     console.log(firstUsersBeers)

//     // EAGER LOADING
//     const users_beers = await db.user.findAll({
//       include: [db.beer]
//     })

//     const foundUser = await db.user.findOne({
//       where: {
//         id: 1
//       },
//       include: {
//         model: db.beer,
//         include: db.users_beer
//       }
//     })

//     console.log(foundUser)
//   } catch (err) {
//     console.log(err)
//   }
}

manyCrud()