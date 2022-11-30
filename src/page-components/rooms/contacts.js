import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUserGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toastNotify } from "../../components/helper";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import {
  getContacts,
  findUser,
  addContact,
  selectContacts,
  ADDCONTACT,
} from "../../store/reducers/contactReducer";
import { selectUser, selectAuthorize } from "../../store/reducers/userReducer";
import Input from "../../components/form/input";
import Button from "../../components/form/button";

function Contacts(props) {
  const user = useSelector(selectUser);
  const authorize = useSelector(selectAuthorize);
  const contacts = useSelector(selectContacts);
  const [dataTarget, setDataTarget] = useState({});
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const getDataContacts = async () => {
      const response = await dispatch(getContacts({ userId: user.id }));
      if (!response.error) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }
      if (response.error && response.payload.status === 500)
        return toastNotify("Internal Server Error", "error");

      setLoading(false);
      return toastNotify(response.payload.data.message, "warning");
    };
    if (props.openContact && authorize) {
      getDataContacts();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.openContact, authorize]);

  const findDataUser = async () => {
    setLoading(true);
    setModal(false);
    const response = await dispatch(findUser({ username: username }));
    if (!response.error) {
      const targetData = response.payload.data;
      setDataTarget(targetData);
      setLoading(false);
      setModal(true);
      return;
    }

    if (response.error && response.payload.status === 500)
      return toastNotify("Internal Server Error", "error");

    setDataTarget(undefined);
    setLoading(false);
    return toastNotify(response.payload.data.message, "warning");
  };

  const addNewContact = async (target) => {
    setLoading(true);
    setModal(false);
    const response = await dispatch(
      addContact({
        targetId: target.id,
      })
    );
    if (!response.error) {
      dispatch(ADDCONTACT(target));
      reset();
      return;
    }

    if (response.error && response.payload.status === 500)
      return toastNotify("Internal Server Error", "error");

    setLoading(false);
    return toastNotify(response.payload.data.message, "warning");
  };

  const getUsername = (value) => {
    if (value.length >= 0) setUsername(value);
    if (value.length <= 0) setModal(false);
  };

  const reset = () => {
    setLoading(false);
    setModal(false);
    setDataTarget({});
    setUsername("");
  };

  const data = contacts.filter((contact) => {
    if (username === "") return contact;
    if (
      contact.username
        .toString()
        .toLowerCase()
        .includes(username.toString().toLowerCase())
    )
      return contact;

    return false;
  });

  return (
    <div className={`slide-room ${props.openContact && "active"} bg-light`}>
      <div className="section-header">
        <span className="text-white ml-2">Contact</span>
        <div
          className="circle-hover mr-1"
          onClick={() => props.setOpenContact(false)}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-white mx-2 my-1"
            size="xl"
          />
        </div>
      </div>
      <BeatLoader
        loading={loading}
        className="text-center"
        color="#4a8db7"
        style={{
          position: "absolute",
          display: "block",
          width: "100%",
          height: "calc(60% - 60px)",
          paddingTop: "60%",
          backgroundColor: "#f1f1f162",
        }}
      />
      {!group && (
        <div
          className="w-full flex flex-row bg-white border-b-2 border-b-light hover:bg-light py-1 px-3 cursor-pointer"
          onClick={() => setGroup(true)}
        >
          <div className="w-2/12">
            <FontAwesomeIcon
              icon={faUserGroup}
              className="my-2 ml-2"
              size="lg"
            />
            <FontAwesomeIcon icon={faPlus} className="my-2" size="xs" />
          </div>
          <div className="w-10/12 my-2">
            <span className="text-dark">Create Group</span>
          </div>
        </div>
      )}
      <div className="flex bg-white border-b-2 border-b-light p-2 justify-center">
        <Input
          className="block h-[34px] w-10/12 pl-3 pr-2 rounded-md border border-secondary focus:outline-none focus:ring-primary-1 focus:border-primary-1 sm:text-sm"
          style={{ width: "90%" }}
          type="text"
          placeholder="Type username to search or add new contact"
          onChange={(e) => getUsername(e)}
          value={username}
        />
      </div>
      {data
        .sort((a, b) =>
          a.name.charAt(0).toLowerCase() > b.name.charAt(0).toLowerCase()
            ? 1
            : -1
        )
        .map((contact, index) => (
          <div
            className="flex flex-row py-1 border-b-2 border-b-light cursor-pointer bg-white hover:bg-light"
            key={index}
            onClick={() => props.createRoom(contact.id, contact.name)}
          >
            <div className="w-2/12"></div>
            <div className="w-10/12 flex flex-col gap-1">
              <span>{contact.name}</span>
              <span>{contact.username}</span>
            </div>
          </div>
        ))}
      {username.length > 0 && (
        <div className="text-muted my-2 flex flex-col items-center gap-1">
          <span>No contact found?</span>
          <span>Looking for "{username}"?</span>
          <Button
            className="border-transparent bg-white rounded-md p-1"
            type="submit"
            onClick={findDataUser}
          >{`Find ${username}`}</Button>
        </div>
      )}
      {modal && (
        <div className="w-10/12 bg-white rounded-md m-auto">
          <div className="flex flex-col items-center py-1 gap-1">
            {dataTarget && (
              <>
                <span>{dataTarget.name}</span>
                <span>{dataTarget.username}</span>
              </>
            )}
          </div>
          {dataTarget && (
            <div className="w-full flex justify-center">
              <Button
                className="border-transparent bg-light rounded-md my-2 p-1"
                type="submit"
                onClick={() => addNewContact(dataTarget)}
              >
                Add Contact
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Contacts;
