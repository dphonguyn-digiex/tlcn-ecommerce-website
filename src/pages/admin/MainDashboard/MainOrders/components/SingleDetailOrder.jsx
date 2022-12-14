import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import { BiHome } from 'react-icons/bi';
import { MdOutlineInfo } from 'react-icons/md';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineFieldNumber } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import { GrClose } from 'react-icons/gr';
import { BiCheck } from 'react-icons/bi';
import { statusOrder } from '~/utils/contants.js';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import vietcombank from '~/assets/img/selections/vietcombank.png';
import vnpay from '~/assets/img/selections/vnpay.png';
import momo from '~/assets/img/selections/momo.png';
import creadit from '~/assets/img/selections/credits.png';
import { SelectStateOrder } from './SelectStatusOrder.jsx';
import { ordersActions } from '~/store/actions';
import { updateOrderStatus } from '~/apis/admin/index.js';

import { styles } from './styles.js';

function SingleDetailOrder(props) {
  const { data = [] } = props;
  console.log('data', data)

  const [ state, setState ] = useState({
    status: data?.state
  })


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

  const prd = data.products[0];
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [openModalDelete, setOpenModalDelete] = useState(false);

  const handleOpenModalDelete= () => setOpenModalDelete(true);
  const handleCloseModalDelete = () => setOpenModalDelete(false);
  

  const handleStatePayment = () => {
    let type = data?.payment;
    switch (type) {
      case 'Chuy???n kho???n':
        return 'Chuy???n kho???n';
      case 'MOMO':
        return 'MOMO';
      case 'Th??? Qu???c T???':
        return 'Th??? Qu???c T???';
      default:
        return 'COD';
    }
  };

  const handleupdateOrderStatus = async () => {
    try {
      const body = {
        id : data?._id,
        state: state?.status
      };
      const response = await updateOrderStatus(body,localStorage.getItem('token'));
      console.log('response', response);
      if(response?.data?.statusCode === 200) {
        toast.dismiss();
        toast(<ToastContent content= 'C???p nh???t th??nh c??ng' />, {
          toastId: data._id,
          position: 'bottom-left',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { width: 'auto', backgroundColor: 'rgba(2,1,36,.85)' }
        });
        refetch();
        handleCloseModal();
      }
      else {
        alert('Update fail')
        handleCloseModal();
      }
    } catch (e) {
      console.log(e)
      handleCloseModal();
    }
  };

  console.log('id>>>>>>>>>>>>>>', data?._id)

  const handleDeleteOrder = async () => {
    try {
      const body = {
        id : data?._id,
      };
      const response = await deleteOrder(body,localStorage.getItem('token'));
      console.log('response', response);
      if(response?.data?.statusCode === 200) {
        handleCloseModalDelete();
        toast.dismiss();
        toast(<ToastContent content='X??a th??nh c??ng' />, {
          toastId: data._id,
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
    } catch (e) {
      console.log(e)
    }
  };

  
  return (
    <div>
      <div style={styles.part3}>
        <div style={styles.wrap_part3}>
          <div style={styles.wrap_img}>
            <img src={prd._img} alt="" style={styles.img} onClick={handleOpenModal} />
          </div>
          <div style={styles.part3_main}>
            <div style={{ display: 'flex', cursor: 'pointer' }} onClick={handleOpenModal}>
              <Typography sx={styles.text5}>{prd.name}</Typography>
            </div>
            <div style={styles.part3_1}>
              <div>
                <MdOutlineInfo style={styles.icon3} />
              </div>
              <div>
                {Object.values(prd.configuration).map((config, index) => {
                  return (
                    <Typography key={index} component="span" sx={{ fontSize: '14px' }}>
                      {index < 3 && `??? ${config.toString()} `}
                    </Typography>
                  );
                })}
              </div>
            </div>
            <div style={styles.part3_2}>
              <div>
                <RiMoneyDollarCircleLine style={styles.icon3} />
              </div>
              <Typography sx={styles.text6}>
                {parseInt(prd.price)
                  .toString()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
              </Typography>
              {prd.sale !== 0 && (
                <Typography>
                  <del style={styles.del}>
                    {parseInt(prd.original_price)
                      .toString()
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </del>
                </Typography>
              )}
              {prd.sale !== 0 && <Typography sx={styles.text7}> -{prd.sale}%</Typography>}
            </div>
            <div style={styles.part3_3}>
              <div>
                <AiOutlineFieldNumber style={styles.icon3} />
              </div>
              <div
                style={{
                  borderRadius: '4px',
                  display : 'flex',
                  gap: '10px'
                }}
              >
                <div
                  style={{
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(236, 240, 241,1)',
                  }}
                >
                  <Typography component="span" sx={{ fontSize: '13px', fontWeight: 'bold', pr: '4px' }}>
                    {data.totalItems}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: '13px' }}>
                    s???n ph???m
                  </Typography>
                </div>

                  {state?.status === 'DELIVERED' && (
                    <div
                    style={{
                      backgroundColor: 'rgba(236, 240, 241,1)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={handleOpenModalDelete}
                    >
                    <Typography component="span" sx={{ fontSize: '13px' }}>
                        X??a
                    </Typography>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.box}>
          <div style={{ backgroundColor: '#fff' }}>
            <div style={styles.wrap_header_box}>
              <Typography sx={styles.text10}>Thanh to??n h??a ????n</Typography>
              <GrClose style={styles.icon4} onClick={handleCloseModal} />
            </div>
          </div>
          <div style={styles.main_box}>
            <div style={{ padding: '12px 24px' }}>
              <div style={styles.main_box_content}>
                <Typography sx={styles.text1}>????n h??ng & Th??ng tin thanh to??n</Typography>
                {/* <Typography sx={styles.text15}>{date}</Typography> */}
                <div style={styles.main_box_inside}>
                  <Grid container sx={{ p: '0 0 0 8px' }}>
                    <Grid item md={3}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={styles.text12}>T???ng ti???n</Typography>
                        <Typography sx={Object.assign({ ...styles.text6 }, { p: 0 })}>
                          {parseInt(data?.totalPrice)
                            .toString()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={styles.text12}>Ph????ng th???c thanh to??n</Typography>
                        {/* <Payment /> */}
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={styles.text12}>????n h??ng</Typography>
                        <Typography sx={styles.text13}>{data?._id}</Typography>
                      </div>
                    </Grid>
                    <Grid item md={3} sx={{ alignSelf: 'end' }}>
                      <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <div
                          style={{
                            backgroundColor: 'rgba(248, 250, 252, 1)',
                            borderRadius: '8px'
                          }}
                        >
                          {/* <Typography sx={styles.text14}>{statusOrder?.[data?.state]}</Typography> */}
                          
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <div style={styles.container}>
                  <Typography sx={styles.text1}>Th??ng tin nh???n h??ng</Typography>
                  <div style={styles.part5}>
                    <div style={styles.wrap_part5}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <BiHome style={Object.assign({ ...styles.icon2 }, { color: '#14cdc8' })} />
                        {/* <Typography sx={Object.assign({ ...styles.text15 }, { p: 0 })}>Nh???n t???i {_address}</Typography> */}
                      </div>
                      <Typography sx={Object.assign({ ...styles.text15 }, { p: 0, fontSize: '16px' })}>
                        {data?.fullname}, {data?.phone}
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }}>{data?.address}</Typography>
                    </div>
                  </div>
                  <SelectStateOrder
                      type={data?.state}
                      selectedStatus={(value)=>setState({...state,status: value})}
                    />
                </div>
                <div style={styles.container}>
                  <Typography sx={styles.text1}>Chi ti???t ????n h??ng</Typography>
                  {data?.products.map((product, index) => {
                    return (
                      <div key={index} style={Object.assign({ ...styles.part3 }, { marginBottom: '8px' })}>
                        <div style={styles.wrap_part3}>
                          <div style={styles.wrap_img}>
                            <img src={product._img} alt="" style={styles.img} />
                          </div>
                          <div style={styles.part3_main}>
                            <div style={{ display: 'flex' }}>
                              <Link to={`/product/${product.type}s/${product.id}`} style={{ textDecoration: 'none' }}>
                                <Typography sx={styles.text5}>{product.name}</Typography>
                              </Link>
                            </div>
                            <div style={styles.part3_2}>
                              <div>
                                <RiMoneyDollarCircleLine style={styles.icon3} />
                              </div>
                              <Typography sx={styles.text6}>
                                {parseInt(product.price)
                                  .toString()
                                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                              </Typography>
                              {product.sale !== 0 && (
                                <Typography>
                                  <del style={styles.del}>
                                    {parseInt(product.original_price)
                                      .toString()
                                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                                  </del>
                                </Typography>
                              )}
                              {product.sale !== 0 && <Typography sx={styles.text7}> -{product.sale}%</Typography>}
                            </div>
                            <div style={styles.part3_3}>
                              <div>
                                <AiOutlineFieldNumber style={styles.icon3} />
                              </div>
                              <div
                                style={{
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(236, 240, 241,1)'
                                }}
                              >
                                <div
                                  style={{
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <Typography component="span" sx={{ fontSize: '13px' }}>
                                    S??? l?????ng
                                  </Typography>
                                  <Typography
                                    component="span"
                                    sx={{
                                      fontSize: '13px',
                                      fontWeight: 'bold',
                                      pl: '4px'
                                    }}
                                  >
                                    {product.quantity}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={styles.container}>
                    <Typography sx={styles.text1}>
                      Thanh to??n qua :<Typography sx={styles.text1}>{handleStatePayment()}</Typography>
                    </Typography>
                    

                    {/* <RadioGroup value={valueRadio}>
                      <Box sx={styles.box_payment}>
                        <FormControlLabel value="Chuy???n kho???n" control={<Radio />} />
                        <div style={styles.aside_box_payment}>
                          <Typography sx={styles.text16}>Chuy???n kho???n</Typography>
                          {showInfoBanking && (
                            <div style={styles.aside_content}>
                              <div>
                                <img src={vietcombank} alt="" style={styles.img1} />
                              </div>
                              <Typography sx={styles.text17}>Vietcombank - Ng??n H??ng Ngo???i Th????ng Vi???t Nam</Typography>
                              <Typography sx={styles.text19}>
                                Ch??? t??i kho???n: <strong>NGUYEN BUI DUY PHONG</strong>
                              </Typography>
                              <Typography sx={styles.text19}>
                                S??? t??i kho???n: <strong>0123456789101112</strong>
                              </Typography>
                              <div style={styles.box_info1}>
                                <Typography sx={styles.text18}>
                                  <strong>N???i dung chuy???n kho???n</strong> 'T??n kh??ch h??ng, s??? ??i???n tho???i'
                                </Typography>
                                <Typography sx={styles.text18}>
                                  <strong>V?? d???</strong> 'Nguyen Van A, 0912345678'
                                </Typography>
                              </div>
                              <div style={styles.box_info2}>
                                <Typography sx={styles.text18}>
                                  B???n h??y ch???n <strong>D???ch v??? chuy???n ti???n 24/7</strong> ????? giao d???ch ???????c ho??n th??nh
                                  nhanh ch??ng
                                </Typography>
                              </div>
                            </div>
                          )}
                        </div>
                      </Box>
                      <Box sx={styles.box_payment}>
                        <FormControlLabel value="Th??? ATM" control={<Radio />} />
                        <div style={styles.aside_box_payment}>
                          <Typography sx={Object.assign({ ...styles.text16 }, { pb: '4px' })}>Th??? ATM</Typography>
                          <Typography sx={styles.text20}>H??? tr??? t???t c??? ng??n h??ng Vi???t Nam</Typography>
                        </div>
                      </Box>
                      <Box sx={styles.box_payment} >
                        <FormControlLabel value="VN Pay" control={<Radio />} />
                        <div style={Object.assign({ ...styles.aside_box_payment }, { display: 'flex' })}>
                          <Typography sx={styles.text16}>Thanh to??n qua </Typography>
                          <div>
                            <img src={vnpay} alt="vnpay" style={styles.img2} />
                          </div>
                        </div>
                      </Box>
                      <Box sx={styles.box_payment}>
                        <FormControlLabel value="MOMO" control={<Radio />} />
                        <div style={Object.assign({ ...styles.aside_box_payment }, { display: 'flex' })}>
                          <Typography sx={styles.text16}>Thanh to??n qua </Typography>
                          <div>
                            <img src={momo} alt="momo" style={styles.img3} />
                          </div>
                        </div>
                      </Box>
                      <Box sx={styles.box_payment}>
                        <FormControlLabel value="Th??? Qu???c T???" control={<Radio />} />
                        <div style={styles.aside_box_payment_payment}>
                          <Typography sx={Object.assign({ ...styles.text4 }, { pb: '4px' })}>Th??? Qu???c T???</Typography>
                          <Typography sx={styles.text21}>H??? tr??? Visa, Master, JCB</Typography>
                          <img src={creadit} alt="credits" style={{ paddingBottom: '12px' }} />
                        </div>
                      </Box>
                    </RadioGroup> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '#fff' }}>
            <div style={{ padding: '12px 24px', display: 'flex' }}>
              <Button sx={Object.assign({ ...styles.btn1 }, { flex: 1 })} onClick={handleupdateOrderStatus}>
                <Typography sx={styles.text8}>C???p nh???t ????n h??ng</Typography>
              </Button>
              <Button onClick={handleCloseModal} sx={Object.assign({ ...styles.btn2 }, { flex: 1 })}>
                <Typography sx={styles.text9}>????ng</Typography>
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openModalDelete}
        onClose={handleCloseModalDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <div style={{ backgroundColor: '#fff' , height:'180px', width:'500px', position:'absolute', top:"40%", left:'40%', borderRadius:'30px'}}>
            <div className = 'modalDeleteOrder'>
             
            <Typography sx={styles.text10}>B???n c?? ch???c ch???n mu???n x??a ????n n??y </Typography>
              <div className="btnDeleteArea">
                <Button sx={Object.assign({ ...styles.btn1 }, { flex: 1 })} onClick={handleDeleteOrder}>
                    <Typography sx={styles.text8}>C??</Typography>
                  </Button>
                  <Button onClick={handleCloseModalDelete} sx={Object.assign({ ...styles.btn2 }, { flex: 1 })}>
                    <Typography sx={styles.text9}>H???y</Typography>
                  </Button>
              </div>
            </div>
          </div>
      </Modal>
    </div>
  );
}

export default SingleDetailOrder;
