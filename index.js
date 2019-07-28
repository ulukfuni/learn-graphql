const { ApolloServer, gql } = require('apollo-server')
const threeHouses = require('./info')

// String! means its non-nullable
// [Member!]! means you can expect stuff coming back because Member is non-nullable and the array will be non-nullable as well
//gql is graphql language
const typeDefs = gql`
    type House {
        houseName: String!,
        members: [Member!]!
    }
    type Member {
        # member name
        name: String!,
        # whether they are the leader or not
        leader: Boolean,
        # to show how to add properties that are not in the info
        favorite: Boolean,
    }
    type Query {
        allHousesInfo: [House],
        member(name: String!): Member,
        getLeaders: [Member]
    }
`

const resolvers = {
    Query: {
        // query {
        //     allHousesInfo {
        //       houseName,
        //       members {
        //         name,
        //         leader
        //       }
        //     }
        //   }
        allHousesInfo: () => threeHouses,
        // query {
        //     member(name: "Claude von Riegan") {
        //       name,
        //       leader
        //     }
        //   }
        member: (parent, params, ctx) => {
            if (params.name) {
                const member = threeHouses.map(house => {
                    return house.members.filter(member => {
                        return member.name.includes(params.name)
                    })
                }).flat()[0]
                if (!member) return 'member'
                if (member) return member
            }
        },
        // query {
        //     getLeaders {
        //       name
        //     }
        //   }
        getLeaders: () => {
            return threeHouses.map(house => {
                return house.members.filter(member => {
                    return member.leader
                })
            }).flat()
        },
    },
    // you can add static or dynamic values to your query here
    // query {
    //     member(name: "Claude von Riegan") {
    //       name,
    //       leader,
    //       favorite
    //     }
    //   }
    Member: {
        favorite: (parent) => {
            console.log(parent)

            return true
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(data => console.log(`server started at port ${data.port}, ${data.url}`))