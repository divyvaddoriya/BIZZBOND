import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate,useParams } from 'react-router'
import {
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductByIdQuery,
    useUploadProductImageMutation
} from '../../redux/api/productApiSlice.js'
import {
useFetchCategoriesQuery
}from '../../redux/api/categoryApiSlice.js'
import { toast } from 'react-toastify'
import AdminMenu from './AdminMenu.jsx'

const ProductUpdate = () => {
    const params= useParams();
    const {data: productData} = useGetProductByIdQuery(params._id)

    const [image,setImage]  = useState(productData?.image || "")
    const [name,setName] =useState(productData?.name || "")
    const [description, setDesctiption] = useState(productData?.description || "")
    const [price, setPrice] = useState(productData?.price || 0)
    const [quantity,setQuantity] = useState(productData?.quantity || '')
    const [category, setCategory] = useState(productData?.category || '')
    const [brand, setBrand] = useState(productData?.brand || '')
    const [stock, setStock] = useState(productData?.countInStock  )

    const navigate =useNavigate()

    const {data: categories=[]} = useFetchCategoriesQuery();
    const [uploadProductImage]=useUpdateProductMutation()
    const [updateProduct] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()

    useEffect(()=>{
        if(productData && productData._id){
            setName(productData.name)
            setDesctiption(productData.description)
            setPrice(productData.price)
            setCategory(productData.categories?._id)
            setQuantity(productData.quantity)
            setBrand(productData.brand)
            setImage(productData.image)
        }
    },[productData])


    const uploadFileHandler =  async(e)=>{
        const formData= new FormData()
        formData.append("image",e.target.files[0])

        try {
            const res = await uploadProductImage(formData).unwrap()
            toast.success("item added succesfully")
            setImage(res.image)
           
        } catch (error) {
            toast.error(error?.data?.message || error.message)            
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("quantity", quantity);
            formData.append("brand", brand);
            formData.append("countInStock", stock);
    
          const { data } = await updateProduct({productId: params._id, formData});
    
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(`${data.name} is succesfully updated`);
            navigate("/admin/allproductslist");
        }
    } catch (error) {
        console.error(error);
        toast.error("Product update failed . try again ");
    }
};

const handleDelete = async()=>{
    try {
        let answer = window.confirm("Are you sure you wanted to delete this product")
        if(!answer){
            return;
        }
        const {data} = await deleteProduct(params._id)
        toast.success(`${data.name} is deleted`)
        navigate("/admin/allproductslist");
            
        } catch (error) {
            console.log(error);
            toast.error("delete failed , try again ")
        }
      }

  return <div className='container xl:mx-[9rem] sm:mx-[0]'>
  <div className="flex flex-col md:flex-row">
      {/* admin menu */}
      <AdminMenu />
      <div className='md:w-3/4 p-3'>
          <div className="h-12 text-black">
              Create Poduct
              {image && (
                  <div className="text-center">
                      <img src={image} alt="product" className='block mx-auto max-h-[200px]' />
                  </div>
              )}

              <div className="mb-3">
                  <label className='border border-blue-400  px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11'>
                      {image ? image.name : "upload image"}
                      <input type="file" name='image' accept="image/*"
                      onChange={uploadFileHandler}
                       className={!image ? "hidden" : "text-black" } 
                      />
                  </label>
              </div>

              <div className="p-3">
                  <div className="flex flex-wrap">
                      <div className="one">
                          <label htmlFor="name" >Name</label><br />
                          <input type="text" className='p-4 mb-3 w-[30rem] rounded-lg bg-[#101011] text-white' value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      <div className="two ml-10">
                          <label htmlFor="name block" >Price</label><br />
                          <input type="number" className='p-4 mb-3 w-[30rem] rounded-lg bg-[#101011] text-white' value={price} onChange={e => setPrice(e.target.value)} />
                      </div>
                  </div>
                  <div className="flex flex-wrap">
                      <div className="one">
                          <label htmlFor="name block" >Quantity</label><br />
                          <input type="number" className='p-4 mb-3 w-[30rem] rounded-lg bg-[#101011] text-white' value={quantity} onChange={e => setQuantity(e.target.value)} />
                      </div>
                      <div className="two ml-10">
                          <label htmlFor="name block" >Brand</label><br />
                          <input type="text" className='p-4 mb-3 w-[30rem] rounded-lg bg-[#101011] text-white' value={brand} onChange={e => setBrand(e.target.value)} />
                      </div>
                  </div>
                  <label className='my-5 '>Description</label>
                  <textarea type='text' className='p-2 mb-3 bg-[#101011] rounded-lg w-[95%] text-white ' value={description} onChange={e => setDesctiption(e.target.value)}>

                  </textarea>
                  <div className="flex justify-between">
                      <div>
                          <label htmlFor="name block">
                              Count in Stock
                          </label> <br />
                          <input type="text" className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white' value={stock} onChange={e => setStock(e.target.value)} />
                      </div>
                      <div>
                          <label >Category</label> <br />
                          <select aria-placeholder='choose category' className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white' onChange={e => setCategory(e.target.value)}>
                              {categories?.map((c)=>(
                                  <option key={c._id} value={c._id} >
                                      {c.name}
                                  </option>
                              ))}
                          </select>
                      </div>
                  </div>
                  <div>

                          <button
                           onClick={handleSubmit}
                        className='py-4 px-10 mt-5 rounded-lg text-white text-lg font-bold bg-green-600'>
                              Update
                          </button>
                          <button
                           onClick={handleDelete}
                        className='py-4 px-10 mt-5 rounded-lg text-white text-lg font-bold bg-pink-600'>
                              Delete
                          </button>
                                </div>
              </div>

          </div>
      </div>
  </div>
</div>
}

export default ProductUpdate