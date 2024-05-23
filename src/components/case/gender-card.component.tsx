import React from 'react'
import { iCharmGenderEnum } from '../../constants/caseManagement'
import "../../scss/components/_genderCard.scss"

interface IGenderComp {
    image:string,
    text:string,
    selectedGender:number,
    numberOfGender:number
}

const Gender = ({ image, text, selectedGender, numberOfGender}: IGenderComp) => {
    const [gender, setGender] = React.useState<number>(iCharmGenderEnum.Male)

    React.useEffect(() => {
        selectedGender ? setGender(selectedGender) : setGender(iCharmGenderEnum.Male)
    }, [selectedGender])
    
    return(
        <>
        <div className={`gender-card " ${gender === numberOfGender ? "selected" : ""}`}>
            <img className="gender-card-img" src={image}></img>
            <p className="gender-card-text">{text}</p>
        </div>
        </>
    )
}
export default Gender;