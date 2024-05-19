import React from 'react'
import { useState } from 'react'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useFetchCategoriesQuery
} from '../../redux/api/categoryApiSlice'

import { toast } from 'react-toastify'
import CategoryForm from '../../components/CategoryForm'
import Modal from '../../components/Modal'
import AdminMenu from './AdminMenu'

const CategoryList = () => {

  const { data: categories } = useFetchCategoriesQuery()
  console.log(categories);
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [updatingName, setUpdatingName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const handleCreateCategory = async (e) => {
    e.preventDefault()

    if (!name) {
      toast.error('category name is required')
      return
    }
    try {
      const result = await createCategory({ name }).unwrap()
      if (result.error) {
        toast.error(result.error)
      }
      else {
        setName("")
        toast.success(`${result.name} is created`)
      }
    } catch (error) {
      console.error(error)
      toast.error("creating category failed, try again ")
    }

  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()

    if (!updatingName) {
      toast.error('category name is required')
      return
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id, updateCategory: {
          name: updatingName
        }
      }).unwrap()

      if (result.error) {
        toast.error(result.error)
      }
      else {
        toast.success(`${result.name} is updates`)
        setSelectedCategory(null)
        setUpdatingName('')
        setModalVisible(false)
      }


    } catch (error) {
      console.log(error);
    }

  }


  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap()

      if (result.error) {
        toast.error(result.error)
      }
else{
  toast.success(`${result.name} is deleted`)
  setSelectedCategory(null)
  setModalVisible(false)
}

    } catch (error) {
      console.error(error)
      toast.error('Category deletion failed,try again ')
    }
  }

  return (
    <div className='ml-[10rem] flex flex-col md:flex-row '>
<AdminMenu />
      <div className='md:w-3/4 p-3 '>
        <div className="h-12 text-black">Manage Category</div>
        <CategoryForm value={name} setValue={setName} handleSubmit={handleCreateCategory} />
        <br />
        <hr />

        <div className="flex felx-wrap ">
          {categories?.map(category => (
            <div key={category._id}>
              <button className='bg-black border-pink-500 border text-white px-4 py-2 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50' onClick={() => {
                {
                  setModalVisible(true)
                  setSelectedCategory(category)
                  setUpdatingName(category.name)
                }
              }}>{category.name}</button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} >
          <CategoryForm value={updatingName} setValue={value => setUpdatingName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText='Update'
            handleDelete={handleDeleteCategory}
          />
        </Modal>

      </div>
    </div>)
}
export default CategoryList