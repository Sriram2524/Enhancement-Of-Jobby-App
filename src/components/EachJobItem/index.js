import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import SimilarJobs from '../SimilarJobs'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class EachJobItem extends Component {
  state = {
    eachJobDetails: [],
    eachSimilarJob: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItem()
  }

  getJobItem = async () => {
    const {match} = this.props
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        title: each.title,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        lifeAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        skills: each.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
      }))
      const updatatedSimilarJobItems = data.similar_jobs.map(
        eachSimilarJob => ({
          companyLogoUrl: eachSimilarJob.company_logo_url,
          employmentType: eachSimilarJob.employment_type,
          id: eachSimilarJob.id,
          jobDescription: eachSimilarJob.job_description,
          location: eachSimilarJob.location,
          rating: eachSimilarJob.rating,
          title: eachSimilarJob.title,
        }),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        eachJobDetails: formattedData,
        eachSimilarJob: updatatedSimilarJobItems,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsListView = () => {
    const {eachJobDetails, eachSimilarJob} = this.state
    console.log(eachJobDetails)
    console.log(eachSimilarJob)
    if (eachJobDetails.length >= 1) {
      const {
        companyLogoUrl,
        employmentType,
        jobDescription,
        location,
        packagePerAnnum,
        rating,
        title,
        companyWebsiteUrl,
        skills,
        lifeAtCompany,
      } = eachJobDetails[0]
      return (
        <div className="job-item-details">
          <div className="each-job-details-container">
            <div className="com-logo-con">
              <img
                className="company-logo"
                alt="job details company logo"
                src={companyLogoUrl}
              />
              <div className="title-con">
                <h1 className="job-title">{title}</h1>
                <div className="rating-con">
                  <AiFillStar />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-pack-con">
              <div className="location-free-con">
                <div className="location-container">
                  <MdLocationOn />
                  <p className="location">{location}</p>
                </div>
                <div className="freelance-container">
                  <p className="location">{employmentType}</p>
                </div>
              </div>
              <p className="lpa">{packagePerAnnum}</p>
            </div>
            <hr className="horisontal-line" />
            <div className="anchor-con">
              <h1 className="des-heading">Description</h1>
              <a className="anchor" href={companyWebsiteUrl}>
                Visit
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
            <h1 className="skill-heading">Skills</h1>
            <ul className="unordered-skills">
              {skills.map(eachSkill => (
                <li key={eachSkill.name} className="skill-list">
                  <img
                    className="skill-img"
                    alt={eachSkill.name}
                    src={eachSkill.imageUrl}
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="life-at-company-con">
              <p className="life-at-company-description">
                {lifeAtCompany.description}
              </p>
              <img
                className="life-at-company-img"
                alt="life at company"
                src={lifeAtCompany.imageUrl}
              />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="unordered-similar-list">
            {eachSimilarJob.map(eachSimilar => (
              <SimilarJobs eachSimilarJobs={eachSimilar} key={eachSimilar.id} />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  renderLoadingView = () => (
    <div className="job-itemloader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  clickRetry = () => {
    this.getJobItem()
  }

  renderFailureView = () => (
    <div className="jobs-itemfailure-con">
      <img
        className="fai-img"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="job-failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button onClick={this.clickRetry} type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobItemDetails()}
      </>
    )
  }
}
export default EachJobItem
