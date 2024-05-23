import { FC } from 'react'
import '../../scss/components/_progress.scss'

interface IProgressPropsProps {
    img:string,
    title:string,
    description:string,
    progressBarImg:string
}
const ProgressPropsComponent : FC<IProgressPropsProps> = ({ img , title , description, progressBarImg}) => {
    return(
        <>
            <div>
                <div className="title-bar">
                    <div className="description">
                        <img src={img}/>
                        <h3 className="description-title">{title}</h3>
                        <p className="description-desc">{description}</p>
                    </div>
                </div>
                <div className="description-img-div">
                    <img src={progressBarImg} className="description-img"/>
                </div>
            </div>
        </>
    )
}

export default ProgressPropsComponent;