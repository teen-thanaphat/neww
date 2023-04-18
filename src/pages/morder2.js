import Axios from 'axios'
import React from "react";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Mshow() {

    const [orderm, setOrderm] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCriteria, setSearchCriteria] = useState("material_name"); // Default search criteria is material_name
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        getOrderm();
    }, []);

    const getOrderm = async () => {
        const response = await Axios.get('http://202.44.40.185:3001/order_material2');
        setOrderm(response.data.reverse()); // Reverse
    };

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    }

    const handleSearchCriteria = event => {
        setSearchCriteria(event.target.value);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = orderm.filter(val =>
        val[searchCriteria].toLowerCase().includes(searchTerm.toLowerCase())
        || (val.order_material_date && new Date(val.order_material_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).includes(searchTerm))
    ).slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(orderm.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const displayname = sessionStorage.getItem('displayname');

    return (
        <div className="columns mt-5 is-centered">
            <div className="column is-half">

                <div className="field">
                    <div className="control">
                        <div className="select">
                            <select value={searchCriteria} onChange={handleSearchCriteria}>
                                <option value="material_name">ชื่อวัสดุ</option>
                                <option value="material_Id">เลขวัสดุ</option>
                                <option value="order_material_date">วันที่</option>
                            </select>
                        </div>
                        <input
                            className="input"
                            type="text"
                            placeholder={`ค้นหา`}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>

                            <th scope="col">เลขวัสดุ</th>
                            <th scope="col">ชื่อวัสดุ</th>
                            <th scope="col">จำนวนที่เบิก</th>
                            <th scope="col">วันที่เบิก</th>
                            <th scope="col">ชื่อผู้เบิก</th>
                            <th scope="col">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((val, index) => {
                            if (val.username === displayname) {
                                return (
                                    <tr key={val.order_material_Id}>
                                        <td>{val.material_Id}</td>
                                        <td>{val.material_name}</td>
                                        <td>{val.order_material_quantity}</td>
                                        <td>{(val.order_material_date == null) ? "" : new Date(val.order_material_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                                        <td>{val.username}</td>
                                        <td>{val.order_material_status}</td>
                                    </tr>
                                )
                            } else {
                                return null;
                            }
                        })}
                    </tbody>

                </table>
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(1)} className="page-link">หน้าแรก</button>
                        </li>
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(currentPage - 1)} className="page-link">ก่อนหน้า</button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => {
                            if (index + 1 === currentPage) {
                                return (
                                    <li key={index} className="page-item active">
                                        <button className="page-link">{index + 1}</button>
                                    </li>
                                );
                            } else if (
                                index + 1 >= currentPage - 9 &&
                                index + 1 <= currentPage + 9 &&
                                index + 1 !== totalPages
                            ) {
                                return (
                                    <li key={index} className="page-item">
                                        <button onClick={() => paginate(index + 1)} className="page-link">{index + 1}</button>
                                    </li>
                                );
                            } else if (index + 1 === currentPage - 10 || index + 1 === currentPage + 10) {
                                return (
                                    <li key={index} className="page-item disabled">
                                        <button className="page-link">...</button>
                                    </li>
                                );
                            } else if (index + 1 === totalPages) {
                                return (
                                    <li key={index} className="page-item">
                                        <button onClick={() => paginate(totalPages)} className="page-link">{totalPages}</button>
                                    </li>
                                );
                            }
                            return null;
                        })}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(currentPage + 1)} className="page-link">ถัดไป</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};
export default Mshow