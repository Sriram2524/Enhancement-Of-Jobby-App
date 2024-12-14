import {Component} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'
import Header from '../Header'

import Profile from '../Profile'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const locationList = [
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },
  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    checkboxInputs: [],
    locationInput: [],
    jobsDetails: [],
    activeSalaryId: '',
  }

  componentDidMount() {
    this.onGetJobDetails()
  }

  onGetJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, checkboxInputs, activeSalaryId} = this.state
    const {locationInput} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${activeSalaryId}&location=${locationInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const jobsData = await response.json()
      const formattedData = jobsData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsDetails: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader
        className='loader'
        type='ThreeDots'
        color='#ffffff'
        height='50'
        width='50'
      />
    </div>
  )

  onGetRadioOption = event => {
    this.setState({activeSalaryId: event.target.id}, this.onGetJobDetails)
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        // eslint-disable-next-line no-unused-vars
        prevState => ({checkboxInputs: filteredData}),
        this.onGetJobDetails,
      )
    }
  }

  onChangeLoations = event => {
    const {locationInput} = this.state
    const inputNotInList = locationInput.filter(
      each => each === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          locationInput: [...prevState.locationInput, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filteredData = locationInput.filter(
        each => each !== each.event.target.id,
      )
      this.setState(
        // eslint-disable-next-line no-unused-vars
        prevState => ({locationInput: filteredData}),
        this.onGetJobDetails,
      )
    }
  }

  clickRetry = () => {
    this.onGetJobDetails()
  }

  renderFailureView = () => (
    <div className='jobs-failure-con'>
      <img
        className='fai-img'
        alt='failure view'
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
      />
      <h1 className='jobs-failure-heading'>Oops! Something Went Wrong</h1>
      <p className='job-failure-para'>
        We cannot seem to find the page you are looking for
      </p>
      <button onClick={this.clickRetry} type='button' className='retry-button'>
        Retry
      </button>
    </div>
  )

  renderProductsListView = () => {
    const {jobsDetails} = this.state
    const length = jobsDetails.length === 0
    return (
      <>
        {length ? (
          <div className='no-jobs-container'>
            <img
              className='no-jobs-img'
              src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
              alt='no jobs'
            />
            <h1>No jobs found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        ) : (
          <ul className='unordered-job-details-con'>
            {jobsDetails.map(each => (
              <JobItem eachJobDetails={each} key={each.id} />
            ))}
          </ul>
        )}
      </>
    )
  }

  renderJobsContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.onGetJobDetails()
  }

  onKeyDownInput = event => {
    if (event.key === 'Enter') {
      this.onGetJobDetails()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />

        <div className='jobs-container'>
          <div className='left-con'>
            <div className='inpt-con'>
              <input
                onChange={this.onSearchInput}
                onKeyDown={this.onKeyDownInput}
                className='search-input'
                value={searchInput}
                placeholder='Search'
                type='search'
              />
              <button
                data-testid='searchButton'
                className='search-button'
                type='button'
                onClick={this.onClickSearch}
              >
                <AiOutlineSearch />
              </button>
            </div>
            <Profile />
            <hr className='hori-line' />
            <h1 className='type-heading'>Type of Employment</h1>
            <ul className='unordered-checkbox'>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId} className='checkbox-list'>
                  <input
                    type='checkbox'
                    id={each.employmentTypeId}
                    className='input'
                    onChange={this.onGetInputOption}
                  />
                  <label className='labell' htmlFor={each.employmentTypeId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className='hori-line' />
            <h1 className='type-heading'>Salary Range</h1>
            <ul className='unordered-radio'>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId} className='radio-list'>
                  <input
                    name='option'
                    onChange={this.onGetRadioOption}
                    className='radio'
                    type='radio'
                    id={each.salaryRangeId}
                  />
                  <label htmlFor={each.salaryRangeId} className='label'>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className='hori-line' />
            <h1 className='type-heading'>Location</h1>
            <ul className='unordered-checkbox'>
              {locationList.map(each => (
                <li key={each.locationId} className='checkbox-list'>
                  <input
                    type='checkbox'
                    id={each.locationId}
                    className='input'
                    onChange={this.onChangeLoations}
                  />
                  <label className='label' htmlFor={each.locationId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className='right-con'>
            <div className='input-con'>
              <input
                onChange={this.onSearchInput}
                onKeyDown={this.onKeyDownInput}
                className='search-input'
                value={searchInput}
                placeholder='Search'
                type='search'
              />
              <button
                data-testid='searchButton'
                className='search-button'
                type='button'
                onClick={this.onClickSearch}
              >
                <AiOutlineSearch />
              </button>
            </div>
            {this.renderJobsContent()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
