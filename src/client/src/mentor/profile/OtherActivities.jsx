import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

const ResolvedQueries = ({ queries, isMod, handleModAction }) => (
  <div className="overflow-auto mb-4">
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Type
          </th>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Info
          </th>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Status
          </th>
          {isMod && (
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {queries.map((query, index) => (
          <tr key={index}>
            <td className="border-b border-blue-gray-50 p-4">{query.type}</td>
            <td className="border-b border-blue-gray-50 p-4">{query.info}</td>
            <td className="border-b border-blue-gray-50 p-4">{query.status}</td>
            {isMod && (
              <td className="border-b border-blue-gray-50 p-4">
                <Button
                  size="small"
                  color="green"
                  onClick={() => handleModAction(query, "Approve")}
                  className="mr-2"
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  color="red"
                  onClick={() => handleModAction(query, "Reject")}
                  className="mr-2"
                >
                  Reject
                </Button>
                {query.modOption === "Change to Approved" && (
                  <Button
                    size="small"
                    color="blue"
                    onClick={() => handleModAction(query, "Change to Approved")}
                  >
                    Change to Approved
                  </Button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RejectedQueries = ({ queries, isMod, handleModAction }) => (
  <div className="overflow-auto mb-4">
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Type
          </th>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Info
          </th>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Status
          </th>
          {isMod && (
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {queries.map((query, index) => (
          <tr key={index}>
            <td className="border-b border-blue-gray-50 p-4">{query.type}</td>
            <td className="border-b border-blue-gray-50 p-4">{query.info}</td>
            <td className="border-b border-blue-gray-50 p-4">{query.status}</td>
            {isMod && (
              <td className="border-b border-blue-gray-50 p-4">
                {query.modOption === "Change to Approved" && (
                  <Button
                    size="small"
                    color="blue"
                    onClick={() => handleModAction(query, "Change to Approved")}
                  >
                    Change to Approved
                  </Button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ExpiredOpportunities = ({ opportunities }) => (
  <div className="overflow-auto mb-4">
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Type
          </th>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Info
          </th>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {opportunities.map((opportunity, index) => (
          <tr key={index}>
            <td className="border-b border-blue-gray-50 p-4">
              {opportunity.type}
            </td>
            <td className="border-b border-blue-gray-50 p-4">
              {opportunity.info}
            </td>
            <td className="border-b border-blue-gray-50 p-4">
              {opportunity.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RejectedAttendances = ({ attendances, isMod, handleModAction }) => (
  <div className="overflow-auto mb-4">
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Type
          </th>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Info
          </th>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            Status
          </th>
          {isMod && (
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {attendances.map((attendance, index) => (
          <tr key={index}>
            <td className="border-b border-blue-gray-50 p-4">
              {attendance.type}
            </td>
            <td className="border-b border-blue-gray-50 p-4">
              {attendance.info}
            </td>
            <td className="border-b border-blue-gray-50 p-4">
              {attendance.status}
            </td>
            {isMod && (
              <td className="border-b border-blue-gray-50 p-4">
                <Button
                  size="small"
                  color="blue"
                  onClick={() =>
                    handleModAction(attendance, "Change to Approved")
                  }
                >
                  Change to Approved
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OtherActivities = ({
  resolvedQueries,
  rejectedQueries,
  expiredOpportunities,
  rejectedAttendances,
  isMod,
  handleModAction,
}) => (
  <Card className="w-full mb-4">
    <CardBody>
      <Typography variant="h5" className="mb-4">
        Other Activity
      </Typography>
      <Typography variant="h6" className="mb-4">
        RESOLVED queries taken by them, i.e. hours not approved or rejected
      </Typography>
      <ResolvedQueries
        queries={resolvedQueries}
        isMod={isMod}
        handleModAction={handleModAction}
      />
      <Typography variant="h6" className="mb-4">
        Queries taken by them with REJECTED hours
      </Typography>
      <RejectedQueries
        queries={rejectedQueries}
        isMod={isMod}
        handleModAction={handleModAction}
      />
      <Typography variant="h6" className="mb-4">
        EXPIRED opportunities floated by them
      </Typography>
      <ExpiredOpportunities opportunities={expiredOpportunities} />
      <Typography variant="h6" className="mb-4">
        EXPIRED opportunities taken by them
      </Typography>
      <ExpiredOpportunities opportunities={expiredOpportunities} />
      <Typography variant="h6" className="mb-4">
        Their REJECTED Attendances
      </Typography>
      <RejectedAttendances
        attendances={rejectedAttendances}
        isMod={isMod}
        handleModAction={handleModAction}
      />
    </CardBody>
  </Card>
);

export default OtherActivities;
