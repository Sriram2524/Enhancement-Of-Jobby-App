import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobItem = props => {
  const {eachJobDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJobDetails

  return (
    <Link className="link" to={`/jobs/${id}`}>
      <li className="each-job-list">
        <div className="com-logo-con">
          <img
            className="company-logo"
            alt="company logo"
            src={companyLogoUrl}
          />
          <div className="title-con">
            <h1 className="title">{title}</h1>
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
          <h1 className="lpa">{packagePerAnnum}</h1>
        </div>
        <hr className="horisontal-line" />
        <h1 className="des-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItem
