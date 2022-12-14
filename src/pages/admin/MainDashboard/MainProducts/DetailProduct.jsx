import React, {useState, useEffect} from 'react'
import { Container, Box, Button, Grid, Modal, Typography } from '@mui/material';
import {fetchDeviceDetail} from '~/apis/index'
import {updateProduct,deleteProduct} from '~/apis/admin/index'
import { BiCheck } from 'react-icons/bi';

import { toast, ToastContainer } from 'react-toastify';

const ToastContent = (props) => {
    const {content} = props;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ display: 'flex' }}>
        <BiCheck style={{ fontSize: '24px' }} />
        <Typography> {content}</Typography>
      </div>
    </div>
  )}


export default function DetailProduct(props) {
    var listImg = [];
    let type = localStorage.getItem('selectedTypeProduct');
    const [ state, setState ] = useState({
        data: [],
        name: '',
        quantity: 0,
        sale: 0,
        img: [],
        color: '',
        original_price: 0,
        sku: '',
    });
    const {idProduct="",handleCloseModalDetail, refetchData} = props;

 

    const getDetailProduct = async () => {
        console.log('type >>>>>>>> ', idProduct)
        const response = await fetchDeviceDetail(type, idProduct);
        console.log('response', response);
        if(response) {
            setState({...state,data:response});
        }
    }

    useEffect(() => {
        getDetailProduct();
    },[idProduct, type])

    const handleProduct = async () => {
        if(idProduct) {
            const body = {
                _id: state?.data?._id,
                name: state?.name === "" ? state?.data?.name : state?.name ,
                quantity: state?.quantity == 0 ? state?.data?.quantity : state?.quantity,
                sale: state?.sale == 0 ? state?.data?.sale : state?.sale,
                type: state?.type,
                original_price: state?.original_price == 0 ? state?.data?.original_price : state?.original_price,
                sale_price: Number(state?.original_price - (state?.original_price * (state?.sale/100))),
                sku: state?.sku === '' ? state?.data?.sku : state?.sku,
                type_product: type,
                img: state?.img.length === 0 ? state?.data?.img : state?.img
            }
            const response = await updateProduct(body);
            if (response) {
                refetchData()
                handleCloseModalDetail()
                toast.dismiss();
                toast(<ToastContent content= 'C???p nh???t th??nh c??ng' />, {
                  toastId: idProduct,
                  position: 'bottom-left',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  style: { width: 'auto', backgroundColor: 'rgba(2,1,36,.85)' }
                });
            }

        } else {

        }
    }

    const handleInputImg = (value) => {
        listImg.push(value);
        setState({...state,img:listImg});
    }

    const handleDeleteProduct = async () => {
        const response = await deleteProduct({
            type_product:type,
            _id:state?.data?._id
        })
        if (response?.statusCode == 200) {
            refetchData()
            handleCloseModalDetail()
            toast.dismiss();
            toast(<ToastContent content= 'X??a Th??nh C??ng' />, {
                toastId: idProduct,
                position: 'bottom-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { width: 'auto', backgroundColor: 'rgba(2,1,36,.85)' }
              });
        }
    }

  return (
    <div>
    <Container>
        <div className="detailModal">
               
                <div className="infoProduct">
                    <div className ='labelProduct'>T??n S???n Ph???m</div>
                    <input defaultValue={state?.data?.name} className= 'fillDetailProduct' onChange={(e)=>setState({...state,name:e.target.value})}/>
                </div>

                <div className="infoProduct">
                    <div className ='labelProduct'>T??n Vi???t T???t</div>
                    <input defaultValue={state?.data?.sku} className= 'fillDetailProduct' onChange={(e)=>setState({...state,sku:e.target.value})}/>
                </div>

                <div className="infoProduct">
                    <div className ='labelProduct'>Gi?? G???c</div>
                    <input defaultValue={state?.data?.original_price} className= 'fillDetailProduct'  onChange={(e)=>setState({...state,original_price:Number(e.target.value)})}/>
                </div>
                <div className="infoProduct">
                    <div className ='labelProduct'>Sale</div>
                    <input defaultValue={state?.data?.sale || 0} className= 'fillDetailProduct'  onChange={(e)=>setState({...state,sale:Number(e.target.value)})}/>
                </div>
                <div className="infoProduct">
                    <div className ='labelProduct'>S??? L?????ng</div>
                    <input defaultValue={state?.data?.quantity} className= 'fillDetailProduct'  onChange={(e)=>setState({...state,quantity:Number(e.target.value)})}/>
                </div>

                <div className="infoProduct">
                    <div className ='labelProduct'>Lo???i</div>
                    <input value={state?.data?.type} className= 'fillDetailProduct'/>
                </div>

                    {state?.data?.img?.map((p, index) => {
                        return (
                            <div className='infoProduct'>
                                <div className ='labelProduct'>???nh {index + 1}</div>
                                <input defaultValue={p} className= 'fillDetailProduct' onChange={(e)=>handleInputImg(e.target.value)}/>
                            </div>
                        ) 
                    })}

                <div className="bottomMOdalProduct">
                    <Button onClick={handleProduct}  >
                        <Typography>C???p Nh???t</Typography>
                    </Button>

                    <Button onClick={handleCloseModalDetail} >
                        <Typography>H???y</Typography>
                    </Button>
                    {idProduct && 
                    <Button onClick={handleDeleteProduct} >
                        <Typography>X??a </Typography>
                    </Button> }
                    
                </div>
                <div className="imgDetailProduct">
                    {state?.data?.img?.map((p, index) => {
                        return <img className ='imgHolder' key={index} src={p} alt="anh san pham" />
                    })}
                </div>
        </div>
      </Container>

    </div>
  )
}
