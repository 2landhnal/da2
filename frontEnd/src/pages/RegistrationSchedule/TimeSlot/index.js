import styles from '../RegistrationSchedule.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import MultiSelectBox from '../../../components/MultiSelectBox';
import { useState } from 'react';

const cx = classNames.bind(styles);
function TimeSlot({ setSchedules, schedule, kList }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [newSlot, setNewSlot] = useState({
        from: '',
        to: '',
        allowed: [],
    });

    const handleAddTimeSlot = (scheduleId) => {
        console.log(selectedItems.map((e) => kList[e].title));
        if (newSlot.from && newSlot.to && selectedItems.length > 0) {
            setSchedules((prevSchedules) =>
                prevSchedules.map((schedule) =>
                    schedule.id === scheduleId
                        ? {
                              ...schedule,
                              timeSlots: [
                                  ...schedule.timeSlots,
                                  {
                                      time: `${newSlot.from} to ${newSlot.to}`,
                                      allowed: selectedItems.map(
                                          (e) => kList[e].title,
                                      ),
                                  },
                              ],
                          }
                        : schedule,
                ),
            );
            setNewSlot({ from: '', to: '', allowed: [] });
            setSelectedItems([]);
        }
    };
    return (
        <div className={cx('newTimeSlot')}>
            <FontAwesomeIcon
                icon={faCirclePlus}
                onClick={() => handleAddTimeSlot(schedule.id)}
            />
            <input
                type="time"
                value={newSlot.from}
                onChange={(e) => {
                    console.log(e.target.value);
                    setNewSlot({
                        ...newSlot,
                        from: e.target.value,
                    });
                }}
                className={cx('input')}
            />
            <input
                type="time"
                value={newSlot.to}
                onChange={(e) => {
                    console.log(e.target.value);
                    setNewSlot({
                        ...newSlot,
                        to: e.target.value,
                    });
                }}
                className={cx('input')}
            />
            <MultiSelectBox
                itemList={kList}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />
        </div>
    );
}

export default TimeSlot;
