import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";

import { GET_API } from "../components/API/GetAPI";
import { EditIcon } from "../components/Customized/EditIcon";
import AddMoneyByAdmin from "./AddMoneyByAdmin";
import TransferMoneyToUserByAdmin from "./TransferMoneyToUserByAdmin";

const Wallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalEdit = () => {
    setIsModalOpenEdit(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenEdit(false);
  };
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [activeItem, setActiveItem] = useState(0);
  const filteredData = dataSource?.filter((item) => {
    // return item.Wallet.toLowerCase().includes(nameFilter.toLocaleLowerCase());
  });
  const getWallet = async () => {
    const GET_ALL = `{
      getAllWallets {
        ownUser {
            uname
            id
        }
        ownDmc {
            id
            name
        }
        ownCoop {
            id
            name
        }
        ownHtl {
            id
            name
        }
        walletInfo {
            totalBal {
                curr
                availableHolding
                availableNonHolding
            }
            deposits {
                curr
                data {
                    amount
                    curr
                }
            }
            withdraws {
                curr
                data {
                    amount
                    curr
                }
            }
            transactions {
                curr
                data {
                    Tamount
                    VAT
                    book_type
                }
            }
        }
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });

      if (res.data) {
        const tableArray = res.data.getAllWallets?.map((item) => ({
          key: item.id,
          id: item.id,
          deposit: item.walletInfo.deposits.data?.amount,
          withdraw: item.walletInfo.withdraws.data?.amount,
          transaction: item.walletInfo.transactions.data?.amount,
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  // Handling switching tabs
  const items = ["All", " Fund", " Withdraw", "Settings"];
  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: "deposit",
      dataIndex: "deposit",
      key: "deposit",
      sorter: (a, b) => (a.deposit ? a.deposit.localeCompare(b.deposit) : ""),
    },
    {
      title: "withdraw",
      dataIndex: "withdraw",
      key: "withdraw",
      sorter: (a, b) =>
        a.withdraw ? a.withdraw.localeCompare(b.withdraw) : "",
    },
    {
      title: "transaction",
      dataIndex: "transaction",
      key: "transaction",
      sorter: (a, b) =>
        a.transaction ? a.transaction.localeCompare(b.transaction) : "",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span className="w-full flex justify-center">
          <Popover
            content={
              <div className="flex flex-col gap-3">
                <Button onClick={showModalEdit} className="action-btn">
                  edit
                </Button>
              </div>
            }
          >
            {EditIcon}
          </Popover>
          <Modal
            footer={false}
            open={isModalOpenEdit}
            onOk={handleCancel}
            onCancel={handleCancel}
          >
            {/* <EditWallet record={record}
                    getWallet={getWallet}
                    handleCancel={handleCancel}
                  /> */}
          </Modal>
        </span>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="search-bar"
            prefix={<SearchOutlined />}
            placeholder="Search Name"
          />
          <Button className="filter-bar" icon={<BsFilter />}>
            Filter
          </Button>
        </div>
        {activeItem > 0 && (
          <Button
            onClick={showModal}
            className="button-bar"
            icon={
              activeItem === 1 ? (
                <PlusOutlined />
              ) : activeItem === 2 ? (
                <MinusOutlined />
              ) : (
                ""
              )
            }
          >
            {activeItem === 1
              ? "Fund Wallet"
              : activeItem === 2
              ? "Withdraw"
              : activeItem === 3
              ? "Transfer"
              : ""}
          </Button>
        )}
        <Modal
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          {activeItem === 1 && (
            <AddMoneyByAdmin
              getWallet={getWallet}
              handleCancel={handleCancel}
            />
          )}
          {activeItem === 2 && (
            <TransferMoneyToUserByAdmin
              getWallet={getWallet}
              handleCancel={handleCancel}
            />
          )}
        </Modal>
      </div>
      <ul className="list-none tab-btn  flex justify-between my-2 max-w-[300px]">
        {items.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer capitalize ${
              activeItem === index ? "font-bold tab-btn-active" : ""
            }`}
            onClick={() => handleItemClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>
      <Table
        size="small"
        dataSource={filteredData}
        columns={columns}
        loading={loading}
      />
    </section>
  );
};

export default Wallet;
