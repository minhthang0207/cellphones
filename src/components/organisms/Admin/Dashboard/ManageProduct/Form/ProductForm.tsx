"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProduct,
  getAllBrand,
  getAllCategory,
  getProductWithAllAttribute,
  updateProduct,
} from "@/lib";
import Loading from "@/components/organisms/Loading";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "sonner";
import VariantTableForm from "./VariantTableForm";

interface ProductImage {
  id: string;
  url: string;
  product_id: string;
  createdAt: string;
  updatedAt: string;
}

const ProductForm: React.FC = () => {
  const searchParams = useSearchParams(); // Lấy query params từ URL
  const id = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [listBrand, setListBrand] = useState<Brand[]>([]);
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const fileInputProductImageRef = useRef<HTMLInputElement | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);

  const fileInputProductImagesRef = useRef<HTMLInputElement | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    origin: "",
    description: "",
    category_id: "",
    brand_id: "",
  });

  const [mainImage, setMainImage] = useState<string>("");

  const [listImage, setListImage] = useState<ProductImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]); // Danh sách id ảnh cần xóa

  const router = useRouter();

  const handleRemoveImagesOnUpdate = (imageId: string) => {
    setRemovedImageIds([...removedImageIds, imageId]); // Lưu id ảnh cần xóa
    setListImage((prev) => prev.filter((img) => img.id !== imageId)); // Cập nhật danh sách hiển thị
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
    }
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setProductImages(Array.from(event.target.files)); // Chuyển đổi `FileList` thành mảng
    }
  };

  const handleRemoveImage = () => {
    // Reset giá trị của input sau khi xóa hình ảnh
    if (fileInputProductImageRef.current) {
      fileInputProductImageRef.current.value = "";
    }

    setProductImage(null);
  };

  const handleRemoveImages = (index: number) => {
    if (productImages.length === 1) {
      // Reset giá trị của input sau khi xóa hình ảnh
      if (fileInputProductImagesRef.current) {
        fileInputProductImagesRef.current.value = "";
      }
    }
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleBrandChange = (value: string) => {
    setFormData({
      ...formData,
      brand_id: value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category_id: value,
    });
  };

  const validate = () => {
    if (!formData.name) {
      toast.error("Bạn cần nhập tên sản phẩm");
      return false;
    }

    if (!formData.brand_id) {
      toast.error("Bạn cần chọn thương hiệu cho sản phẩm");
      return false;
    }

    if (!formData.category_id) {
      toast.error("Bạn cần chọn loại sản phẩm");
      return false;
    }

    if (!formData.price) {
      toast.error("Bạn cần nhập giá cho sản phẩm");
      return false;
    }

    if (!formData.origin) {
      toast.error("Bạn cần nhập nơi xuất xứ cho sản phẩm");
    }

    if (!productImage) {
      toast.error("Bạn cần thêm hình ảnh đại diện cho sản phẩm");
      return false;
    }

    return true;
  };

  const validateEdit = () => {
    if (!formData.name) {
      toast.error("Bạn cần nhập tên sản phẩm");
      return false;
    }

    if (!formData.brand_id) {
      toast.error("Bạn cần chọn thương hiệu cho sản phẩm");
      return false;
    }

    if (!formData.category_id) {
      toast.error("Bạn cần chọn loại sản phẩm");
      return false;
    }

    if (!formData.price) {
      toast.error("Bạn cần nhập giá cho sản phẩm");
      return false;
    }

    if (!formData.origin) {
      toast.error("Bạn cần nhập nơi xuất xứ cho sản phẩm");
    }

    if (!productImage && !mainImage) {
      toast.error("Bạn cần thêm hình ảnh đại diện cho sản phẩm");
      return false;
    }

    if (!productImage && !mainImage) {
      toast.error("Bạn cần thêm hình ảnh đại diện cho sản phẩm");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data;

    if (isEdit) {
      if (!validateEdit()) {
        return;
      }
      data = {
        ...formData,
        product_image: productImage,
        product_images: productImages,
        removed_image_ids: removedImageIds,
      };
      setIsLoading(true);

      if (id) {
        const result = await updateProduct(data, id);
        if (result.success) {
          await fetchProduct();
          setProductImage(null);
          setProductImages([]);
          toast.success("cập nhật thành công");
        } else {
          toast.error(result.message);
        }
      }
    } else {
      if (!validate()) {
        return;
      }
      data = {
        ...formData,
        product_image: productImage,
        product_images: productImages,
      };
      setIsLoading(true);

      const result = await createProduct(data);
      if (result.success) {
        toast.success("Tạo mới thành công");
        router.push("/dashboard-admin/san-pham");
      } else {
        toast.error(result.message);
      }
    }

    setIsLoading(false);
  };

  const fetchProduct = async () => {
    setIsLoading(true);

    // Nếu có `id`, gọi API sản phẩm
    if (id) {
      setIsEdit(true);
      const productResult = await getProductWithAllAttribute(id);
      const { data } = productResult;

      setFormData({
        name: data.name,
        origin: data.origin,
        price: data.price,
        description: data.description,
        category_id: data.category_id,
        brand_id: data.brand_id,
      });

      setMainImage(data.image);
      setListImage(data.productImages);
    } else {
      setIsEdit(false);
      setFormData({
        name: "",
        price: "",
        origin: "",
        description: "",
        category_id: "",
        brand_id: "",
      });
    }

    setIsLoading(false); // Đặt trạng thái tải xong
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Gọi API thương hiệu và danh mục song song
      const [brandResult, categoryResult] = await Promise.all([
        getAllBrand(),
        getAllCategory(),
      ]);

      setListBrand(brandResult.data.brands);
      setListCategory(categoryResult.data.categories);

      // Nếu có `id`, gọi API sản phẩm
      if (id) {
        setIsEdit(true);
        const productResult = await getProductWithAllAttribute(id);
        const { data } = productResult;

        setFormData({
          name: data.name,
          origin: data.origin,
          price: data.price,
          description: data.description,
          category_id: data.category_id,
          brand_id: data.brand_id,
        });

        setMainImage(data.image);
        setListImage(data.productImages);
      } else {
        setIsEdit(false);
        setFormData({
          name: "",
          price: "",
          origin: "",
          description: "",
          category_id: "",
          brand_id: "",
        });
      }

      setIsLoading(false); // Đặt trạng thái tải xong
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (productImage) {
      setMainImage("");
    }
  }, [productImage]);
  if (isLoading) {
    return <Loading hasOverLay={true} />;
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="uppercase text-lg font-bold">
            {isEdit ? "Cập nhật sản phẩm" : "Tạo mới sản phẩm"}{" "}
          </h4>
          <button
            type="submit"
            className="px-4 py-2 bg-red-400 rounded-lg text-white hover:bg-red-500 transition duration-320"
          >
            {isEdit ? "Cập nhật" : "Tạo"}
          </button>
        </div>
        <div className="flex gap-4">
          {/* left */}
          <div className="w-1/2 bg-white rounded-lg shadow-md p-4">
            <h4 className="font-bold text-base mb-2">Thông tin cơ bản</h4>
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-1.5 text-sm">Tên sản phẩm</p>
                <Input
                  placeholder=""
                  className="border-2"
                  value={formData.name}
                  onChange={(e) => handleChangeInput(e, "name")}
                />
              </div>

              <div>
                <p className="mb-1.5 text-sm">Thương hiệu</p>
                <Select
                  value={formData.brand_id}
                  onValueChange={handleBrandChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Thương hiệu</SelectLabel>
                      {listBrand?.map((item) => {
                        return (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="mb-1.5 text-sm">Loại sản phẩm</p>

                <Select
                  value={formData.category_id}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Loại sản phẩm</SelectLabel>
                      {listCategory?.map((item) => {
                        return (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="mb-1.5 text-sm">Giá</p>
                <Input
                  type="number"
                  value={formData.price}
                  className="border-2"
                  onChange={(e) => handleChangeInput(e, "price")}
                  placeholder=""
                />
              </div>

              <div>
                <p className="mb-1.5 text-sm">Nguồn gốc xuất xứ</p>
                <Input
                  placeholder=""
                  className="border-2"
                  value={formData.origin}
                  onChange={(e) => handleChangeInput(e, "origin")}
                />
              </div>

              <div>
                <p className="mb-1.5 text-sm">Mô tả sản phẩm</p>
                <Textarea
                  value={formData.description}
                  onChange={handleChangeDesc}
                />
              </div>
            </div>
          </div>
          {/* right */}
          <div className="w-1/2 bg-white rounded-lg shadow-md p-4">
            <h4 className="font-bold text-base mb-2">Hình ảnh</h4>
            <div className="flex flex-col gap-4">
              <div className="grid w-full  items-center gap-1.5">
                <Label htmlFor="picture" className="text-sm">
                  Hình ảnh đại diện
                </Label>
                <Input
                  className="border-2"
                  ref={fileInputProductImageRef}
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {productImage && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="relative">
                      <Image
                        width={32}
                        height={32}
                        src={URL.createObjectURL(productImage)} // Hiển thị hình ảnh đã chọn
                        alt={productImage.name}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage()} // Xóa hình ảnh
                        className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
                {mainImage && (
                  <div className="flex-gap-4 mt-4">
                    <div className="relative w-32 h-32">
                      <Image
                        src={mainImage} // Hiển thị hình ảnh đã chọn
                        alt="Hình ảnh sản phẩm"
                        className="w-full h-full object-cover rounded-md"
                        fill
                      />
                      <button
                        type="button"
                        onClick={() => setMainImage("")} // Xóa hình ảnh
                        className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
                {}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="picture" className="text-sm">
                  Danh sách hình ảnh sản phẩm
                </Label>
                <Input
                  className="border-2"
                  ref={fileInputProductImagesRef}
                  id="picture"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                />
                <div className="mt-4">
                  {productImages.length > 0 && (
                    <div className="flex gap-4 mb-4">
                      {productImages.map((file, index) => (
                        <div key={index} className="relative">
                          <Image
                            width={32}
                            height={32}
                            src={URL.createObjectURL(file)} // Hiển thị hình ảnh đã chọn
                            alt={file.name}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImages(index)} // Xóa hình ảnh
                            className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {listImage?.length > 0 && (
                    <div className="flex gap-4  flex-wrap">
                      {listImage.map((item) => (
                        <div key={item.id} className="relative w-32 h-32">
                          <Image
                            src={item.url} // Hiển thị hình ảnh đã chọn
                            alt="Hình ảnh sản phẩm"
                            className="w-full h-full object-cover rounded-md"
                            fill
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImagesOnUpdate(item.id)} // Xóa hình ảnh
                            className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {id && isEdit && (
        <div className="mt-4 p-4  rounded-lg shadow-md bg-white">
          <VariantTableForm id={id} />
        </div>
      )}
    </div>
  );
};
export default ProductForm;
