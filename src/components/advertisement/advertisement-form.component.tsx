import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import i18n from '../../i18n';
import { IAdvertise } from '../../redux/domains/Advertise';

import '../../scss/components/_advertisementForm.scss';

interface IAdvertisementProps {
    adsItem: IAdvertise;
    onSubmit: (ads: IAdvertise) => void;
    onCancel: () => void;
}

const AdvertisementForm: React.FC<IAdvertisementProps> = ({ adsItem, onSubmit, onCancel }) => {

    const [editAds, setEditAds] = useState<IAdvertise>(adsItem);
    const [nameValid, setNameValid] = useState(true);
    const [fileValid, setFileValid] = useState(true);
    const [imageSizeValid, setImageSizeValid] = useState(true);

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setEditAds({ ...editAds, file: e.target.files[0], url: '', filePath: '' });
            setFileValid(true);
        } else {
            setEditAds({ ...editAds, file: undefined, url: '', filePath: '' });
            setFileValid(false);
        }
    }

    const handleSubmit = () => {
        if(editAds.file !== undefined && editAds.name !== ''){
            onSubmit(editAds);
        } else {
            setFileValid(editAds.file !== undefined);
            setNameValid(editAds.name !== '');
        }
    }

    const onImgLoad = ({target:img} : any) => {
        setImageSizeValid(Math.round(img.width /img.height) === 3);
    }

    useEffect(() => {
        setEditAds(adsItem);
    }, [adsItem])

    return (
        <div>
            {
                editAds &&
                <Container className="advertisement-continer">
                    <Row>
                        <Col sm="12">
                            <Form className="advertisement-form">

                                <Row className="mb-3">
                                    <Col sm={12} md={4}></Col>
                                    <Col sm={12} md={8}>
                                        <Form.Group className="mt-2 mb-0 text-left">
                                            <Form.Check type="checkbox" label="Active" checked={!editAds.disabled} onChange={e => {
                                                setEditAds({ ...editAds, disabled: !e.target.checked });
                                            }}></Form.Check>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col sm={12} md={4}><div className="mt-2 text-left">{i18n.t("NAME")}</div></Col>
                                    <Col sm={12} md={8}>
                                        <Form.Group className=" mb-0">
                                            <Form.Control
                                                type="text"
                                                className="text-input-case__input"
                                                value={editAds.name}
                                                onChange={e => {
                                                    setEditAds({ ...editAds, name: e.target.value });
                                                    setNameValid(e.target.value !== '');
                                                }}
                                                isInvalid={!nameValid}
                                            ></Form.Control>
                                            <Form.Control.Feedback type="invalid">{i18n.t("NAME_IS_REQUIRED")}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col sm={12} md={4}><div className="mt-2 text-left">{i18n.t("FILE")}</div></Col>
                                    <Col sm={12} md={8}>
                                        <Form.Group className="mb-0">
                                            <Form.File
                                                id="custom-file"
                                                label={i18n.t("CHOOSE_THE_IMAGE")}
                                                placeholder="cat.png"
                                                custom
                                                onChange={onFileChange}
                                                isInvalid={!fileValid}
                                                required
                                            />
                                            <span className={(editAds.url !== '' || editAds.file !== undefined) ? (imageSizeValid ? 'small text-success' : 'small text-danger') : 'small'}>{i18n.t("ASPECT_RATIO")}</span>
                                            <img src={editAds.file ? URL.createObjectURL(editAds.file) : editAds.url} className="pt-3" onLoad={onImgLoad}></img>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12">
                                        <Form.Group className="modal__footer-full mb-0">
                                            <Button
                                                variant="primary"
                                                className="modal__footer-button modal__btn-margin-right"
                                                type="button"
                                                onClick={() => handleSubmit()}
                                                disabled={!nameValid || !fileValid}>
                                                {i18n.t("SUBMIT")}
                                            </Button>
                                            <Button variant="outline-primary" className="modal__footer-button modal__btn-margin-left" onClick={onCancel}>
                                                {i18n.t("CANCEL")}
                                            </Button>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            }

        </div>
    )
}

export default AdvertisementForm;