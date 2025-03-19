void DataValidationNode::SyncCallback() {
    if (as_status==0) //status OFF so don't publish anything
        return;

    global_flag_.xsens_validation = false;
    global_flag_.mm5_validation = false;
    global_flag_.imu_velocity_validation = false;
    global_flag_.camera_left_validation = false;
    global_flag_.camera_right_validation = false;
    global_flag_.lidar_validation = false;
    global_flag_.wheel_speed_validation = false;
    global_flag_.steering_validation = false;

    time_now = this->get_clock()->now();

    if ((time_now - last_valid_xsens_stamp).seconds() < xsens_timout){
        //RCLCPP_INFO(rclcpp::get_logger(""), "%f", (time_now - last_valid_xsens_stamp).seconds());
        global_flag_.xsens_validation = true;
    }
    if ((time_now - last_valid_ws_stamp).seconds() < ws_timeout){
        global_flag_.wheel_speed_validation = true;
    }
    if ((time_now - last_valid_mm5_stamp).seconds() < mm5_timeout){
        global_flag_.mm5_validation = true;
    }
    if ((time_now - last_valid_imuvel_stamp).seconds() < imuvel_timeout){
        global_flag_.imu_velocity_validation = true;
    }
    if ((time_now - last_valid_steering_stamp).seconds() < steering_timeout){
        global_flag_.steering_validation = true;
    }
    if ((time_now - last_valid_lidar_stamp).seconds() < lidar_timeout){
        global_flag_.lidar_validation = true;
    }
    if ((time_now - last_valid_camleft_stamp).seconds() < camleft_timeout){
        global_flag_.camera_left_validation = true;
    }
    if ((time_now - last_valid_camright_stamp).seconds() < camright_timeout){
        global_flag_.camera_right_validation = true;
    }

    global_flag_.header.stamp = time_now;
    validation_flag_->publish(global_flag_);
    What_not_working(); // check which sensors are not working

    system_status = data_validation_->system_operating_check(xsens_dependency,
                                                             mm5_dependency,
                                                             wheel_speed_dependency);
    if(!system_status)
        RCLCPP_INFO(rclcpp::get_logger(""), "SYSTEM NOT OPERABLE");

    //Reset flags for the next iteration
    xsens_received_msg = false;
    mm5_received_msg = false;
    wheel_speed_received_msg = false;
    steering_received_msg = false;
    imu_velocity_received_msg = false;
    lidar_received_msg = false;
    camera_right_received_msg = false;
    camera_left_received_msg = false;
  }