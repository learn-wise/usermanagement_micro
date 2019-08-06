const gql = require('graphql-tag')

export default gql`
  mutation UsersList($filter: String, $show: Int!, $search: String, $page: Int) {
  usersList(filter: $filter, show: $show, search: $search, page: $page) {
    Users {
      _id
      name
      email
      isVerified
      createdAt
      lastLogin
      status
    }
    errorMessage
    totalUsers
    hasNextPage
    hasPreviousPage
    lastPage
    show
    filter
    search
    currentPage
  }
}
`