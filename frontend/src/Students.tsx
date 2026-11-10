import { useState } from "react";
import {
  App,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { api, queryString } from "./api";
import ReportDownload from "./ReportDownload";
import { useRemote } from "./useRemote";
import type { Lookups, Page, Student } from "./types";
import {
  EmptyData,
  ErrorNotice,
  fullName,
  genderLabels,
  RoomTag,
  type PageProps,
} from "./shared";

interface StudentForm {
  studentCode: string;
  prefixId: number;
  firstName: string;
  lastName: string;
  genderId: number;
  birthDate: Dayjs;
  gradeLevelId: number;
}

export default function Students({ revision, onChange }: PageProps) {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<{
    studentCode?: string;
    name?: string;
    gradeLevelId?: number;
  }>({});
  const [searchForm] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const result = useRemote<Page<Student>>(
    `/students?${queryString({ ...filters, page, pageSize })}`,
    revision,
  );
  const lookups = useRemote<Lookups>("/lookups");
  const [editing, setEditing] = useState<Student | null>();
  const [form] = Form.useForm<StudentForm>();
  const [saving, setSaving] = useState(false);
  const gradeOptions = lookups.data?.grades.map((grade) => ({
    value: grade.id,
    label: grade.name,
  }));

  function open(student: Student | null) {
    form.resetFields();
    if (student) {
      form.setFieldsValue({
        studentCode: student.studentCode,
        prefixId: student.prefixId,
        firstName: student.firstName,
        lastName: student.lastName,
        genderId: student.genderId,
        birthDate: dayjs(student.birthDate),
        gradeLevelId: student.gradeLevelId,
      });
    }
    setEditing(student);
  }

  async function save(values: StudentForm) {
    setSaving(true);
    try {
      const body = {
        ...values,
        birthDate: values.birthDate.format("YYYY-MM-DD"),
      };
      await api(
        editing ? `/students/${editing.id}` : "/students",
        editing ? "PATCH" : "POST",
        body,
      );
      message.success("บันทึกข้อมูลนักเรียนแล้ว");
      setEditing(undefined);
      onChange();
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(student: Student) {
    try {
      await api(`/students/${student.id}`, "DELETE");
      message.success("ลบข้อมูลนักเรียนแล้ว");
      if (result.data?.data.length === 1 && page > 1) setPage(page - 1);
      onChange();
    } catch (error) {
      message.error((error as Error).message);
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>
            <TeamOutlined /> รายชื่อนักเรียน{" "}
            <Tag>{result.data?.total ?? "—"} คน</Tag>
          </h2>
          <p>ข้อมูลนักเรียนที่ใช้งานอยู่ในระบบ</p>
        </div>
        <Space wrap>
          <ReportDownload />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => open(null)}
            disabled={!lookups.data}
          >
            เพิ่มนักเรียน
          </Button>
        </Space>
      </div>
      <ErrorNotice error={lookups.error} retry={lookups.reload} />
      <Form
        name="student-search"
        form={searchForm}
        className="filter-bar"
        layout="vertical"
        onFinish={(values) => {
          setFilters(values);
          setPage(1);
        }}
      >
        <Form.Item name="studentCode" label="เลขประจำตัวนักเรียน">
          <Input allowClear placeholder="เช่น 69001" />
        </Form.Item>
        <Form.Item name="name" label="ชื่อหรือนามสกุล">
          <Input
            allowClear
            prefix={<SearchOutlined className="muted" />}
            placeholder="ค้นหาชื่อหรือนามสกุล"
          />
        </Form.Item>
        <Form.Item name="gradeLevelId" label="ระดับชั้น">
          <Select
            allowClear
            options={gradeOptions}
            placeholder="ทุกระดับชั้น"
          />
        </Form.Item>
        <div className="filter-actions">
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
            ค้นหา
          </Button>
          <Button
            onClick={() => {
              searchForm.resetFields();
              setFilters({});
              setPage(1);
            }}
          >
            ล้างค่า
          </Button>
        </div>
      </Form>
      <ErrorNotice error={result.error} retry={result.reload} />
      <Table<Student>
        rowKey="id"
        loading={result.loading}
        dataSource={result.data?.data ?? []}
        scroll={{ x: 950 }}
        locale={{
          emptyText: (
            <EmptyData
              text="ไม่พบข้อมูลนักเรียน"
              description="เพิ่มนักเรียนใหม่ หรือปรับเงื่อนไขการค้นหา"
            />
          ),
        }}
        pagination={{
          current: page,
          pageSize,
          total: result.data?.total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          showTotal: (total) => `ทั้งหมด ${total} คน`,
          onChange: (p, size) => {
            setPage(size !== pageSize ? 1 : p);
            setPageSize(size);
          },
        }}
        columns={[
          {
            title: "เลขประจำตัว",
            dataIndex: "studentCode",
            width: 130,
            render: (value) => <span className="code-text">{value}</span>,
          },
          {
            title: "ชื่อ–นามสกุล",
            key: "name",
            render: (_, student) => (
              <div className="person">
                <span
                  className={`person-avatar ${student.gender === "female" ? "pink" : ""}`}
                >
                  {student.firstName.slice(0, 1)}
                </span>
                <div>
                  <strong>{fullName(student)}</strong>
                  <span>
                    {genderLabels[student.gender]} ·{" "}
                    {dayjs(student.birthDate).format("D MMM")}{" "}
                    {dayjs(student.birthDate).year() + 543}
                  </span>
                </div>
              </div>
            ),
          },
          {
            title: "ระดับชั้น",
            dataIndex: "gradeLevel",
            width: 100,
            render: (value) => <Tag className="grade-tag">{value}</Tag>,
          },
          {
            title: "ห้องเรียนล่าสุด",
            key: "classroom",
            render: (_, student) => <RoomTag name={student.classroom?.name} />,
          },
          { title: "ปีที่เข้าเรียน", dataIndex: "enrollmentYear", width: 120 },
          {
            title: "จัดการ",
            key: "actions",
            width: 110,
            render: (_, student) => (
              <Space size={2}>
                <Tooltip title="แก้ไขข้อมูล">
                  <Button
                    aria-label={`แก้ไข ${student.studentCode}`}
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => open(student)}
                    disabled={!lookups.data}
                  />
                </Tooltip>
                <Popconfirm
                  title="ลบข้อมูลนักเรียน?"
                  description={`ต้องการลบ ${fullName(student)} ใช่หรือไม่`}
                  onConfirm={() => remove(student)}
                  okText="ลบข้อมูล"
                  cancelText="ยกเลิก"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    aria-label={`ลบ ${student.studentCode}`}
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title={editing ? "แก้ไขข้อมูลนักเรียน" : "เพิ่มนักเรียนใหม่"}
        open={editing !== undefined}
        onCancel={() => {
          if (!saving) setEditing(undefined);
        }}
        width={650}
        footer={null}
        forceRender
        maskClosable={!saving}
      >
        <p className="modal-description">
          เลขประจำตัวสองหลักแรกคือปีที่เข้าเรียน เช่น 69001 หมายถึงปี 2569
        </p>
        <Form
          name="student-editor"
          form={form}
          layout="vertical"
          onFinish={save}
          requiredMark="optional"
        >
          <div className="form-grid">
            <Form.Item
              name="studentCode"
              label="เลขประจำตัวนักเรียน"
              rules={[
                {
                  required: true,
                  pattern: /^\d{2}\S*$/,
                  message: "กรอกเลขประจำตัวที่ขึ้นต้นด้วยปี 2 หลัก",
                },
              ]}
            >
              <Input maxLength={20} placeholder="เช่น 69001" />
            </Form.Item>
            <Form.Item
              name="prefixId"
              label="คำนำหน้าชื่อ"
              rules={[{ required: true, message: "กรุณาเลือกคำนำหน้า" }]}
            >
              <Select
                options={lookups.data?.prefixes.map((prefix) => ({
                  value: prefix.id,
                  label: prefix.name,
                }))}
                onChange={(id) => {
                  const genderId = lookups.data?.prefixes.find(
                    (prefix) => prefix.id === id,
                  )?.genderId;
                  if (genderId) form.setFieldValue("genderId", genderId);
                }}
              />
            </Form.Item>
            <Form.Item
              name="firstName"
              label="ชื่อ"
              rules={[
                { required: true, whitespace: true, message: "กรุณากรอกชื่อ" },
              ]}
            >
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="นามสกุล"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "กรุณากรอกนามสกุล",
                },
              ]}
            >
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item
              name="genderId"
              label="เพศ"
              rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
            >
              <Select
                options={lookups.data?.genders.map((gender) => ({
                  value: gender.id,
                  label: gender.name,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="birthDate"
              label="วันเกิด (ค.ศ.)"
              rules={[{ required: true, message: "กรุณาระบุวันเกิด" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabledDate={(date) => date.isAfter(dayjs(), "day")}
                placeholder="เลือกวันเกิด"
              />
            </Form.Item>
            <Form.Item
              name="gradeLevelId"
              label="ระดับชั้น"
              rules={[{ required: true, message: "กรุณาเลือกระดับชั้น" }]}
            >
              <Select options={gradeOptions} />
            </Form.Item>
          </div>
          <div className="modal-actions">
            <Button onClick={() => setEditing(undefined)} disabled={saving}>
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              บันทึกข้อมูล
            </Button>
          </div>
        </Form>
      </Modal>
    </section>
  );
}
