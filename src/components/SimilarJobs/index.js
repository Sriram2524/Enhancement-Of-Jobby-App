import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarJobs = props => {
  const {eachSimilarJobs} = props
  const {companyLogoUrl, title, jobDescription, location} = eachSimilarJobs
  const {rating, employmentType} = eachSimilarJobs
  return (
    <li className="similar-list">
      <div className="logo-type-container">
        <img
          className="similar-img"
          alt="similar job company logo"
          src={companyLogoUrl}
        />
        <div className="employment-type-con">
          <h1 className="similar-title">{title}</h1>
          <div className="rating-con">
            <AiFillStar />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <div className="location-emp-type-con">
        <p className="location">{location}</p>
        <p className="employment-type">{employmentType}</p>
      </div>
      <h1 className="similar-description-heading">Description</h1>
      <p className="similar-description">{jobDescription}</p>
    </li>
  )
}
export default SimilarJobs
