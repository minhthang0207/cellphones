import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PaginationComponent = ({
  totalPages,
  currentPage,
  handlePageChange,
}: {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}) => {
  // Hàm xác định các trang cần hiển thị
  const getPages = () => {
    const pages: (number | string)[] = [];
    const pageRange = 2; // Hiển thị 2 trang trước và 2 trang sau

    // Trang 1 luôn luôn hiển thị
    pages.push(1);

    // Nếu trang hiện tại lớn hơn pageRange + 1, thì hiển thị dấu ba chấm trước
    if (currentPage > pageRange + 1) pages.push("...");

    // Các trang gần trang hiện tại
    for (
      let i = Math.max(currentPage - pageRange, 2);
      i <= Math.min(currentPage + pageRange, totalPages - 1);
      i++
    ) {
      pages.push(i);
    }

    // Nếu trang hiện tại nhỏ hơn trang cuối trừ đi pageRange, thì hiển thị dấu ba chấm sau
    if (currentPage < totalPages - pageRange - 1) pages.push("...");

    // Trang cuối luôn luôn hiển thị
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {/* Nút Trang trước */}
        <PaginationItem className="">
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            Trang trước
          </PaginationPrevious>
        </PaginationItem>

        {/* Hiển thị các trang */}
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => handlePageChange(Number(page))}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Nút Trang tiếp */}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
          >
            Trang tiếp
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
