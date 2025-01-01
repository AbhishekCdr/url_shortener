import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { enqueueSnackbar } from "notistack";

function ReactCalendar(props) {
  const [value, setValue] = useState(new Date());
  const [loading, setLoading] = useState(false);

  //   console.log(value.toISOString());

  const { handleModalClose, selectedData, fetchData } = props;

  const { _id, expiresAt } = selectedData;

  const handleSubmit = async (_id) => {
    try {
      setLoading(true);
      const payload = {
        expiresAt: value.toISOString(),
      };

      const response = await axios.patch(
        `http://localhost:3000/v1/api/url/expiry/${_id}`,
        payload,
      );

      if (response.status == 200) {
        enqueueSnackbar(response.data.message, {
          variant: "success",
        });
        setLoading(false);
        handleModalClose();
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
      console.log(error);

      setLoading(false);
      handleModalClose();
    } finally {
      setLoading(false);
      handleModalClose();
      fetchData();
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-3 py-3">
      <div className="overflow-hidden">
        <Calendar
          onChange={setValue}
          value={expiresAt}
          minDate={new Date()}
          showFixedNumberOfWeeks={true}
          className="p-4"
          tileClassName="text-center p-2"
        />
      </div>
      <div className="flex gap-10">
        <Button
          variant="outlined"
          color="success"
          size="small"
          disabled={loading}
          onClick={() => handleSubmit(_id)}
        >
          Okay
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={loading}
          onClick={() => handleModalClose()}
          size="small"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default ReactCalendar;
